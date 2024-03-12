use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use rocket::{FromForm, State};
use rand::Rng;
use rand::distributions::Alphanumeric;
use serde::Deserialize;

pub enum ResetEmail{
    EmailTaken,
    Send,
}
pub enum VerifyCodeEmail{
    Correct,
    NotCorrect
}
#[derive(Debug, FromForm, Deserialize)]
pub struct VerifyEmail {
    email: String,
    code: Option<String>,
    pub status: String, 
}

impl VerifyEmail {
    pub async fn verify_code(&self , pool: &State<sqlx::MySqlPool>) -> VerifyCodeEmail {
            let code = sqlx::query_as::<_, (String,)>("SELECT code FROM verify WHERE email = ?")
            .bind(self.email.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        if let Some(code_u) = self.code.clone() {
            
            if code.0 == code_u {
            sqlx::query("DELETE FROM verify WHERE email = ?")
            .bind(self.email.clone())
            .execute(pool.inner())
            .await
            .unwrap();
            return VerifyCodeEmail::Correct;
        }
        return VerifyCodeEmail::NotCorrect;
        }
        print!("{:?}", self.code.clone());
        VerifyCodeEmail::NotCorrect
    }
    async fn send_mail(&self, pool: &State<sqlx::MySqlPool>){
        let random_string: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect();
        sqlx::query("INSERT INTO verify (email, code) VALUES (?,?) ON DUPLICATE KEY UPDATE code = VALUES(code)")
            .bind(self.email.clone())
            .bind(random_string.clone())
            .execute(&**pool)
            .await
            .unwrap();
        let email = Message::builder()
            .from("cleancodereset@gmail.com".parse().unwrap())
            .to(self.email.clone().parse().unwrap())
            .subject("Your register verification code for CleanCode")
            .header(ContentType::TEXT_HTML)
            .body(String::from(format!("<p style='color: black'>Dear User,</p>
                <p style='color: black'>You have registered an accound on CleanCode</p>
                <h3 style='color: #800080'>{}</h3>
                <p style='color: black'>If you did not register ignore this email</p>
                <p style='color: black'>Thank you,<br>CleanCode</p>", random_string)))
            .unwrap();
        let creds = Credentials::new("cleancodereset@gmail.com".to_owned(), "xpey mdej ejmi ytya".to_owned());
        let mailer = SmtpTransport::relay("smtp.gmail.com")
            .unwrap()
            .credentials(creds)
            .build();
        mailer.send(&email).unwrap();
    }
    async fn is_user(&self, pool: &State<sqlx::MySqlPool>) -> bool {
        let taken: (i8, )= sqlx::query_as("SELECT COUNT(*) FROM users WHERE email = ?")
            .bind(self.email.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        taken.0 == 1
    
    }
    pub async fn send_verify_code(&self, pool: &State<sqlx::MySqlPool>) -> ResetEmail{
        if !self.is_user(pool).await{
            VerifyEmail::send_mail(self, pool).await;
            return ResetEmail::Send;
        }
        ResetEmail::EmailTaken
    }
}