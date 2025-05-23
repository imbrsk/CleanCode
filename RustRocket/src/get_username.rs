use rocket::{FromForm, State};
use serde::{Deserialize, Serialize};
use sqlx::Row;

#[derive(Debug, FromForm, Deserialize, Serialize, Clone)]
pub struct Session {
    session: String
}
impl Session{
    pub async fn get_user_id(&self, pool: &State<sqlx::MySqlPool>) -> (String, i32) {
            let user_id: (i8, )= sqlx::query_as("SELECT user_id FROM sessions WHERE session_id = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        let row = sqlx::query("SELECT username, solved FROM users WHERE user_id = ?")
            .bind(user_id.0)
            .fetch_one(&**pool)
            .await
            .unwrap();
        let username: String = row.get("username");
        let solved: i32 = row.get("solved");
        (username, solved)
    }
}