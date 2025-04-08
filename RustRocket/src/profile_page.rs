use rocket::{serde::json::Json, State};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use serde_json::json;
#[derive(Deserialize)]
pub struct ProfilePage{
    session: String
}
#[derive(Deserialize, Serialize)]
pub struct ProfileData{
    email: String,
    username: String,
    solved: Vec<ProblemData>,
}
#[derive(Deserialize, Serialize)]
struct ProblemData{
    path: String,
    name: String,
    subject: String,
    year: String,
    period: String,
    code: String,
}
impl ProfilePage{
    async fn get_user_id(session: String, pool: &State<sqlx::MySqlPool>) -> i32 {
        let user_id: (i8, )= sqlx::query_as("SELECT user_id FROM sessions WHERE session_id = ?")
            .bind(session)
            .fetch_one(&**pool)
            .await
            .unwrap();
        user_id.0.into()
    }
    async fn get_email(user_id: i32, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow {
        let mail= sqlx::query("SELECT email, username FROM users WHERE user_id = ?")
            .bind(user_id)
            .fetch_one(&**pool)
            .await
            .unwrap();
        mail
    }
    async fn get_solved(user_id: i32, pool: &State<sqlx::MySqlPool>) -> Vec<sqlx::mysql::MySqlRow>{
        let solved = sqlx::query("SELECT user_id, problem_id, code FROM solved WHERE user_id = ?")
            .bind(user_id)
            .fetch_all(&**pool)
            .await
            .unwrap();
        solved
    }
    async fn get_problems(user_id: i32, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow{
        let problem = sqlx::query("SELECT path, problem_path, name, year, period, subject FROM subjects WHERE id = ?")
            .bind(user_id)
            .fetch_one(&**pool)
            .await
            .unwrap();
        problem
    }
    pub async fn get_user_data(&self, pool: &State<sqlx::MySqlPool>) -> Json<ProfileData>{
        let user_id = ProfilePage::get_user_id(self.session.clone(),pool).await;
        let solved = ProfilePage::get_solved(user_id, pool).await;
        let user_data = ProfilePage::get_email(user_id, pool).await;
        let email: String  = user_data.get("email");
        let username: String = user_data.get("username");
        let mut data = ProfileData{
            email: email,
            username: username,
            solved: Vec::new(),
        };
        for problems in solved {
            let problem_id: i32 = problems.get("problem_id"); 
            let problem = ProfilePage::get_problems(problem_id, pool).await;
            let path: String = problem.get("path");
            let problem_path: String = problem.get("problem_path");
            let problem_id : i32 = problems.get("problem_id");
            let path_final = format!("{}{}?id={}", path, problem_path, problem_id.to_string());
            let year: i32 = problem.get("year");
            data.solved.push(ProblemData{
                path: path_final,
                name: problem.get("name"),
                subject: problem.get("subject"),
                year: year.to_string(),
                period: problem.get("period"),
                code: problems.get("code"),
            });
        }
        return Json(data);
    }
}
#[derive(Deserialize)]
pub struct ChangeUsername{
    session: String,
    pub username: String,
}
impl ChangeUsername{
    async fn set_new_username(&self, user_id: i32, pool: &State<sqlx::MySqlPool>)-> Result<sqlx::mysql::MySqlQueryResult, sqlx::Error>{
        let response= sqlx::query("UPDATE users SET username = ? WHERE user_id = ?")
            .bind(self.username.clone())
            .bind(user_id)
            .execute(&**pool)
            .await;
        response
    }
    pub async fn change_username_func(&self, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let user_id = ProfilePage::get_user_id(self.session.clone(),pool).await;
        let response = ChangeUsername::set_new_username(self, user_id, pool).await;
        match response {
            Ok(_) => return Json(json!({"status": "success", "response": "Username changed successfully"})),
            Err(_) => return Json(json!({"status": "error", "response": "Username is taken"})),
        }
    }
}