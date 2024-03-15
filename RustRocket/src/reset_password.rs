use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use rand::distributions::Alphanumeric;
use rand::Rng;
use rocket::{FromForm, State};
use serde::Deserialize;

const HTML: &str = r#"
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
        }
        .card {
            width: 500px;
            padding: 20px;      
            background-color: #fff;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            border-radius: 10px;
            position: relative;
        }
        .card a {
            background-color: #008CBA; 
            color: white; 
            padding: 14px 20px; 
            text-align: center; 
            text-decoration: none; 
            display: inline-block;
            font-size: 20px;
        }
        #logo {
            padding: 10px;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 80px;
            height: 80px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Hello CleanCoder,</h2>
        <p>You recently requested to reset your password for your CleanCode account. <br/>Your reset code is:</p>
        <a style="background-color: rgb(36, 36, 36); font-weight: bolder; ">"#;
const HTML1: &str = r#"
        </a>
        <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next 15 minutes.</p>
        <p>Thanks,</p>
        <p>CleanCode</p>
    </div>
</body>
</html>"#;

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
            .body(String::from(format!("{}{}{}",HTML, random_string, HTML1)))
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

