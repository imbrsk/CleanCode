use rocket::serde::json::Json;
use rocket::State;
use serde::Serialize;
use sqlx::Row;

#[derive(Serialize)]
pub struct Subjects{
    subject: String,
    number: i8,
    path: String
}

impl Subjects{
    pub async fn get_subjects(pool: &State<sqlx::MySqlPool>) -> Json<Vec<Subjects>> {
        let subjects = sqlx::query("SELECT DISTINCT subject,path,year FROM subjects")
            .fetch_all(&**pool)
            .await
            .unwrap();
        let mut subjects_list: Vec<Subjects> = Vec::new();
        for row in subjects {
            let subject = Subjects {
                subject: row.get("subject"),
                number: row.get("year"),
                path: row.get("path"),
            };
            subjects_list.push(subject);
        }
        Json(subjects_list)
    }
}