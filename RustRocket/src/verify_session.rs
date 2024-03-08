use rocket::{FromForm, State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

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
        sqlx::query("INSERT INTO sessions (user_id, session_id) VALUES (1, 2) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), session_id = VALUES(session_id)")
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


