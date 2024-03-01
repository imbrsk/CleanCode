use rocket::{serde::json::Json, State};
use sqlx::Row;
use serde::Serialize; 

#[derive(Debug, Serialize)] 
pub struct Leaderboard {
    username: String,
    solved: i32,
}
impl Leaderboard {
    async fn get_top_10(pool: &State<sqlx::MySqlPool>) -> Json<Vec<Leaderboard>> {
        let rows = sqlx::query("SELECT username, solved FROM users ORDER BY solved DESC LIMIT 10")
            .fetch_all(&**pool)
            .await
            .unwrap();
        let mut users: Vec<Leaderboard> = Vec::new();
        for row in rows {
            let user = Leaderboard {
                username: row.get("username"),
                solved: row.get("solved"),
            };
        users.push(user);
        }
        
        Json(users)
    }

    pub async fn get_leaderboard(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
        let leaderboard = Leaderboard::get_top_10(pool).await;
        Json(serde_json::json!(leaderboard.into_inner()))
    }
}