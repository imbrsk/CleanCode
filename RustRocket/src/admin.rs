use rand::{distributions::Alphanumeric, Rng};
use rocket::{serde::json::Json, State};
use serde::{Deserialize, Serialize};
use sqlx::{mysql::MySqlRow, Row};
use bcrypt::verify;
use serde_json::json;
use chrono::{DateTime, Utc};

pub enum AdminLoginResponse {
    Logged,
    Invalid,
}
#[derive(Deserialize)]
pub struct Login {
    token: String,
    password: String,
}
impl Login{
    async fn login_user(&self, pool: &State<sqlx::MySqlPool> ) -> bool{
        let hashed_password = sqlx::query("SELECT password FROM admin WHERE token = ?")
            .bind(self.token.clone())
            .fetch_one(&**pool)
            .await;
        match hashed_password {
            Ok(hashed_password) => {
                let password = self.password.clone();
                let hashed_password = hashed_password.get("password");
                let is_valid = verify(password, hashed_password);
                match is_valid {
                    Ok(is_valid) => is_valid,
                    Err(_) => false,
                }
            }
            Err(_) => false,
        }
    }
    pub async fn login_admin(&self, pool: &State<sqlx::MySqlPool> ) -> AdminLoginResponse{
        if self.login_user(&pool).await{
            return AdminLoginResponse::Logged;
        }
        AdminLoginResponse::Invalid
    }
    pub async fn create_cookie(&self, pool: &State<sqlx::MySqlPool>) -> String{
        let random_string: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(127)
            .map(char::from)
            .collect();
        sqlx::query("INSERT INTO admin_cookies (session, created_at) VALUES (?,NOW())")
            .bind(random_string.clone())
            .execute(&**pool)
            .await
            .unwrap();
        random_string
    }
}

pub struct Create;
impl Create{
    pub async fn create_token(pool: &State<sqlx::MySqlPool>) -> String{
        let random_string: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(127)
            .map(char::from)
            .collect();
        sqlx::query("INSERT INTO admin_token (token, created_at) VALUES (?,NOW())")
            .bind(random_string.clone())
            .execute(&**pool)
            .await
            .unwrap();
        random_string
    }
}
#[derive(Deserialize, Serialize)]
pub struct Token{
    pub token: String,
    pub created_at: String,
}
pub struct Load;
impl Load{
    async fn get_tokens(pool: &State<sqlx::MySqlPool>) -> Vec<MySqlRow>{
        let tokens = sqlx::query("SELECT token, created_at FROM admin_token")
            .fetch_all(&**pool)
            .await
            .unwrap();
        tokens
    }
    pub async fn get_all_tokens(pool: &State<sqlx::MySqlPool>) -> Vec<Token>{
        let mut tokens: Vec<Token>= Vec::new();
        let tokens_row = Load::get_tokens(&pool).await;
        for row in tokens_row{
            let time:DateTime<Utc> = row.get("created_at");
            print!("{}", time.to_string());
            let token = Token{
                token: row.get("token"),
                created_at: time.to_string(),
            };
            tokens.push(token);
        }
        tokens
    }
}
#[derive(Deserialize, Serialize)]
pub struct DeleteToken{
    token: String,
}
impl DeleteToken{
    pub async fn delete_token(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("DELETE FROM admin_token WHERE token = ?")
            .bind(self.token.clone())
            .execute(&**pool)
            .await
            .unwrap();
    }
}
enum TokenLoginResponse{
    Logged,
    Invalid,
}
#[derive(Deserialize, Serialize)]
pub struct TokenLogin{
    token: String,
}
impl TokenLogin{
    async fn chech_token(&self, pool: &State<sqlx::MySqlPool>) -> TokenLoginResponse{
        let token: (i8, ) = sqlx::query_as("SELECT COUNT(*) FROM admin_token WHERE token = ?")
            .bind(self.token.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        match token.0{
            1 => TokenLoginResponse::Logged,
            _ => TokenLoginResponse::Invalid,
        }
    }
    async fn create_cookie(pool: &State<sqlx::MySqlPool>) -> String{
        let random_string: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(127)
            .map(char::from)
            .collect();
        sqlx::query("INSERT INTO token_admin_cookies (session, created_at) VALUES (?,NOW())")
            .bind(random_string.clone())
            .execute(&**pool)
            .await
            .unwrap();
        random_string
    }
    pub async fn login_token(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let response = self.chech_token(&pool).await;
        match response {
            TokenLoginResponse::Logged => {
                let cookie = TokenLogin::create_cookie(&pool).await;
                return Json(json!({
                    "status": "success",
                    "cookie": cookie
                }));
            }
            TokenLoginResponse::Invalid => {
                return Json(json!({
                    "status": "error",
                    "cookie": "incorrect token"
                }));
            }
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct VerifyAdmin{
    session: String,
}
impl VerifyAdmin{
    pub async fn verify_cookie(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let session: (i8, ) = sqlx::query_as("SELECT COUNT(*) FROM admin_cookies WHERE session = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        match session.0{
            1 => return Json(json!({
                    "status": "sucsess",
                })),
            _ => return Json(json!({
                    "status": "error",
                })),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct VerifyToken{
    session: String,
}
impl VerifyToken{
    pub async fn verify_cookie(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let session: (i8, ) = sqlx::query_as("SELECT COUNT(*) FROM token_admin_cookies WHERE session = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        match session.0{
            1 => return Json(json!({
                    "status": "sucsess",
                })),
            _ => return Json(json!({
                    "status": "error",
                })),
        }
    }
}