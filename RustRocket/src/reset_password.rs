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
        sqlx::query("INSERT INTO reset_password (email, reset_token, created_at) VALUES (?,?,NOW()) ON DUPLICATE KEY UPDATE reset_token = VALUES(reset_token), created_at = VALUES(created_at)")
            .bind(self.email.clone())
            .bind(random_string.clone())
            .execute(&**pool)
            .await
            .unwrap();
        let email = Message::builder()
            .from("cleancodereset@gmail.com".parse().unwrap())
            .to(self.email.clone().parse().unwrap())
            .subject("Reset Password for CleanCode")
            .header(ContentType::TEXT_HTML)
            .body(String::from(format!("<p style='color: black'>Dear User,</p>
                <p style='color: black'>We have received a request to reset your password. Please enter the code in the website:</p>
                <h3 style='color: #800080'>{}</h3>
                <p style='color: black'>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged</p>
                <p style='color: black'>Thank you,<br>CleanCode</p>", random_string)))
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
    email: String,
    code: String,
}
impl VerifyCode {
    async fn time(&self, pool: &State<sqlx::MySqlPool>) -> bool {
        let time: (i32, )= sqlx::query_as("SELECT TIMESTAMPDIFF(MINUTE, created_at, NOW()) FROM reset_password WHERE email = ?")
            .bind(self.email.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        time.0 > 15
    }
    async fn verify_token(&self, pool: &State<sqlx::MySqlPool>) -> bool {
        let code: (String, )= sqlx::query_as("SELECT reset_token FROM reset_password WHERE email = ?")
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