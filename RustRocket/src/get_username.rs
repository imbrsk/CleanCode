use rocket::{serde::json::{self, Json}, FromForm, State};
use serde::{de::value::SeqAccessDeserializer, Deserialize, Serialize};
use serde_json::json;
use sqlx::Row;

#[derive(Debug, FromForm, Deserialize, Serialize, Clone)]
pub struct Session {
    session: String
}
impl Session{
    pub async fn get_user_id(&self, pool: &State<sqlx::MySqlPool>) ->  Json<serde_json::Value> {
        let user_id: (i8, )= sqlx::query_as("SELECT user_id FROM sessions WHERE token = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        let row = sqlx::query("SELECT username, solved FROM users WHERE id = ?")
            .bind(user_id.0)
            .fetch_all(&**pool)
            .await
            .unwrap();
        Json(json!({
            "username": row[0].get::<String, usize>(0),
            "solved": row[0].get::<String, usize>(1)
        }))
    }
}