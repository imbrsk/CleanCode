use rocket::{error, serde::json::{self, Json}, FromForm, State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use serde_json::json;


#[derive(Debug, FromForm, Deserialize, Serialize, Clone)]
pub struct LoginData{
    pub email: String,
    pub remember_me: bool,
}
impl LoginData {
    async fn get_user(username: String, pool: &State<sqlx::MySqlPool>) -> Result<(i32,), sqlx::Error> {
        let user_id: Result<(i32,), sqlx::Error> = sqlx::query_as::<_, (i32,)>("SELECT user_id FROM users WHERE email = ?; ")
            .bind(username)
            .fetch_one(&**pool)
            .await;
        match user_id {
            Ok(row) => Ok((row.0,)),
            Err(e) => Err(e),
        }
    } 
    async fn create_session_token(user_id: i32, pool: &State<sqlx::MySqlPool>) -> Result<String, sqlx::Error> {
        let session_id = Uuid::new_v4();
        sqlx::query("INSERT INTO sessions (user_id, session_id) VALUES (?,?)")
            .bind(&user_id)
            .bind(session_id.to_string())
            .execute(&**pool)
            .await
            .unwrap();
            Ok(session_id.to_string())
        }
    async fn create_token(user_id: i32, pool: &State<sqlx::MySqlPool>) -> Result<String, sqlx::Error> {
        let token = Uuid::new_v4();
        sqlx::query("INSERT INTO remember_me (user_id, token) VALUES (?,?)")
            .bind(user_id)
            .bind(token.to_string())
            .execute(&**pool)
            .await
            .unwrap();
        Ok(token.to_string())
    }
    pub async fn create_session(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let user_id_result: Result<(i32,), sqlx::Error> = Self::get_user(self.email.clone(), pool).await;
        let user_id = user_id_result.unwrap().0;
        let session = Self::create_session_token(user_id, pool).await;
        if self.remember_me {
            let token = Self::create_token(user_id, pool).await;
            return Json(json!({
                "session": session.unwrap(),
                "token": token.unwrap()
            })); 
        }
        Json(json!({
            "session": session.unwrap(),
            "token": "none"
        })) 
    }
}