use rocket::{serde::json::{self, Json}, FromForm, State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use serde_json::json;

#[derive(Debug, FromForm, Deserialize, Serialize, Clone)]
pub struct Token{
    token: String
}
impl Token{
    async fn get_user_id(token: String, pool: &State<sqlx::MySqlPool>) -> i32 {
        let user_id: (i8, )= sqlx::query_as("SELECT user_id FROM remember_me WHERE token = ?")
            .bind(token)
            .fetch_one(&**pool)
            .await
            .unwrap();
        user_id.0.into()
    }
    async fn create_session_id(user_id: i32, pool: &State<sqlx::MySqlPool>) ->  String {
        let session_id = Uuid::new_v4();
        sqlx::query("INSERT INTO sessions (user_id, session_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), session_id = VALUES(session_id)")
            .bind(&user_id)
            .bind(session_id.to_string())
            .execute(&**pool)
            .await
            .unwrap();
            session_id.to_string()
    }   
    pub async fn create_session(&self, pool: &State<sqlx::MySqlPool>) ->  String {
        let user_id = Token::get_user_id(self.token.clone(),pool).await;
        let session = Token::create_session_id(user_id, pool).await;
        session
    }
}
#[derive(Deserialize)]
pub struct VerifySession{
    session: String
}
impl VerifySession{
    async fn is_session_valid(token: String, pool: &State<sqlx::MySqlPool>) -> bool {
        let is_valid = sqlx::query("SELECT user_id FROM sessions WHERE session_id = ?")
            .bind(token)
            .fetch_one(&**pool)
            .await;
        match is_valid{
            Ok(_) => true,
            Err(_) => false
        }
    }
    pub async fn verify_session_cookie(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        match VerifySession::is_session_valid(self.session.clone(), pool).await{
            true => Json(json!({"status": "valid"})),
            false => Json(json!({"status": "invalid"}))
        }
    }
}
