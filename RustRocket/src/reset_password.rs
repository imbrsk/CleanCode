use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use rocket::{FromForm, State};
use rand::Rng;
use rand::distributions::Alphanumeric;
use serde::Deserialize;

pub enum Reset{
    EmailNotValid,
    Send,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct ResetPassword{
    email: String,
}
impl ResetPassword{
    async fn is_user(data: String, type_data: String, pool: &State<sqlx::MySqlPool>) -> bool {
        let query = format!("SELECT COUNT(*) FROM users WHERE {} = ?", type_data);
        let taken: (i8, )= sqlx::query_as(&query)
            .bind(data)
            .fetch_one(&**pool)
            .await
            .unwrap();
        taken.0 == 1
    }
    async fn send_reset(&self, pool: &State<sqlx::MySqlPool>){
        let random_string: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect();
        sqlx::query("INSERT INTO reset_password (email, code, time) VALUES (?,?,NOW()) ON DUPLICATE KEY UPDATE code = VALUES(code), time = VALUES(time)")
            .bind(self.email.clone())
            .execute(&**pool)
            .await
            .unwrap();
        let email = Message::builder()
            .from("cleancodereset@gmail.com".parse().unwrap())
            .to(self.email.clone().parse().unwrap())
            .subject("Reset Password for CleanCode")
            .header(ContentType::TEXT_PLAIN)
            .body(String::from(format!("Your passowrd reset code is\n<h3>{}</h3>\nIt will be valid for 15 minutes.", random_string)))
            .unwrap();
        let creds = Credentials::new("cleancodereset@gmail.com".to_owned(), "xpey mdej ejmi ytya".to_owned());// Open a remote connection to gmail
        let mailer = SmtpTransport::relay("smtp.gmail.com")
            .unwrap()
            .credentials(creds)
            .build();
        mailer.send(&email).unwrap();
    }
    pub async fn reset_password(&self, pool: &State<sqlx::MySqlPool>) -> Reset {
        if !ResetPassword::is_user(self.email.clone(), String::from("email"), pool).await{
            return Reset::EmailNotValid;
        }
        ResetPassword::send_reset(self, pool).await;
        Reset::Send
    }
}

pub enum Verify{
    CodeNotValid,
    CodeValid,
    TimeExceeded,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct VerifyCode{
    code: String,
    email: String,
}
impl VerifyCode {
    async fn time(&self, pool: &State<sqlx::MySqlPool>) -> bool {
        let time: (i32, )= sqlx::query_as("SELECT TIMESTAMPDIFF(MINUTE, time, NOW()) FROM reset_password WHERE email = ?")
            .bind(self.email.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        time.0 > 15
    }
    async fn verify_token(&self, pool: &State<sqlx::MySqlPool>) -> bool {
        let code: (String, )= sqlx::query_as("SELECT code FROM reset_password WHERE email = ?")
            .bind(self.email.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        if code.0 == self.code{
            return true;
        }
        false
    }
    async fn delete_reset(&self, pool: &State<sqlx::MySqlPool>) {
        sqlx::query("DELETE FROM reset_password WHERE email = ?")
            .bind(self.email.clone())
            .execute(&**pool)
            .await
            .unwrap();
    }
    pub async fn reset(&self, pool: &State<sqlx::MySqlPool>) -> Verify {
        if VerifyCode::time(self, pool).await {
            return Verify::TimeExceeded;
        }
        if VerifyCode::verify_token(self, pool).await{
            VerifyCode::delete_reset(self, pool).await;
            return Verify::CodeValid;        
        }
        Verify::CodeNotValid
    }
}