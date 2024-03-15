use std::ops::Sub;

use rocket::{form::name, FromForm};
use rocket::serde::json::Json;
use rocket::State;
use serde::{Deserialize, Serialize};
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

#[derive(Debug, FromForm, Deserialize)]
pub struct Subject{
    name: String,
}
#[derive(Serialize)]
pub struct SubjectName{
    year: i32,
    ispiti: Vec<Problem>,
    prvkol: Vec<Problem>,
    vtorkol: Vec<Problem>,
}
#[derive(Serialize)]
pub struct Problem{
    ime: String,
    link: String,
}
impl Subject{
    async fn get_dist_year(&self, pool: &State<sqlx::MySqlPool>) -> Vec<sqlx::mysql::MySqlRow> {
        let years = sqlx::query("SELECT DISTINCT year FROM subjects WHERE path = ?")
            .bind(self.name.clone())
            .fetch_all(&**pool)
            .await
            .unwrap();
        years
    }
    async fn get_problem(&self ,period: String , year: i32 ,pool: &State<sqlx::MySqlPool>) -> Vec<sqlx::mysql::MySqlRow>{
        let problems = sqlx::query("SELECT DISTINCT name, problem_path FROM subjects WHERE period = ? AND path = ? AND year = ?")
            .bind(period)
            .bind(self.name.clone())
            .bind(year)
            .fetch_all(&**pool)
            .await
            .unwrap();
        problems
    }
    pub async fn get_problems(&self, pool: &State<sqlx::MySqlPool>) -> Vec<SubjectName>{
        let years = self.get_dist_year(pool).await;
        let periods = vec!["Колкокфиум 1", "Колкокфиум 2", "Испит"];
        let mut big_j: Vec<SubjectName> = Vec::new();
        for year in years {
            let mut subjects = SubjectName {
                year: year.get("year"),
                ispiti: Vec::new(),
                prvkol: Vec::new(),
                vtorkol: Vec::new(),
            };
            for period in &periods { 
                let problems = self.get_problem(period.to_string(), year.get("year"), pool).await;
                for problem in problems {
                    let name: String = problem.get("name");
                    let problem_path: String = problem.get("problem_path");
                    let problem = Problem {
                        ime: name,
                        link: problem_path,
                    };
                    match period {
                        &"Испит" => subjects.ispiti.push(problem),
                        &"Колкокфиум 1" => subjects.prvkol.push(problem),
                        &"Колкокфиум 2" => subjects.vtorkol.push(problem),
                        _ => (),
                    }
                }
            }
            big_j.push(subjects);
        }
        big_j   
    }
}