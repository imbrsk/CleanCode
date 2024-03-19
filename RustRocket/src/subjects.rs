
use std::path;

use rocket::{tokio::sync::broadcast::error, FromForm};
use rocket::serde::json::Json;
use rocket::State;
use serde::{Deserialize, Serialize};
use sqlx::Row;

#[derive(Debug, FromForm, Deserialize, Serialize)]
pub struct Subjects{
    subject: String,
    number: i32,
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

#[derive(Debug, FromForm, Deserialize, Serialize)]
pub struct Subject{
    name: String,
    session: String,
}
#[derive(Serialize)]
pub struct SubjectName{
    year: String,
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
        let problems = sqlx::query("SELECT DISTINCT name, problem_path, id FROM subjects WHERE period = ? AND path = ? AND year = ?")
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
            let number: i32 = year.get("year");
            let mut subjects = SubjectName {
                year: number.to_string(),
                ispiti: Vec::new(),
                prvkol: Vec::new(),
                vtorkol: Vec::new(),
            };
            for period in &periods { 
                let problems = self.get_problem(period.to_string(), year.get("year"), pool).await;
                for problem in problems {
                    let name: String = problem.get("name");
                    let problem_path: String = problem.get("problem_path");
                    let id: i32 = problem.get("id");
                    let problem = Problem {
                        ime: name,
                        link: format!("{}?id={}", problem_path,id.to_string()),
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
#[derive(Serialize)]
pub struct Path{
    path: String,
}
impl Path{
    async fn get_path_from_table(pool: &State<sqlx::MySqlPool>) -> Vec<sqlx::mysql::MySqlRow>{
        let paths = sqlx::query("SELECT DISTINCT problem_path,id FROM subjects")
            .fetch_all(&**pool)
            .await
            .unwrap();
        paths
    }
    pub async fn get_paths(pool: &State<sqlx::MySqlPool>) -> Vec<Path> {
        let paths = Path::get_path_from_table(pool).await;
        let mut paths_list: Vec<Path> = Vec::new();
        for path in &paths {
            let id: i32  = path.get("id");
            let path: String  = path.get("problem_path");
            let path = Path {
                path: format!("{}?id={}", path, id.to_string()),
            };
            paths_list.push(path);
        }
        paths_list
    }
}
#[derive(Serialize)]
pub struct LoadProblem{
    name: String,
    text: String,
    ex_input: String,
    ex_expected: String,
    code: String,
}
#[derive(Debug, FromForm, Deserialize, Serialize)]
pub struct GetProblem{
    session: String,
    path: String,
}
impl GetProblem{
    async fn get_problem_data(&self, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow{
        let problems = sqlx::query("SELECT name, text, ex_input, ex_output FROM subjects WHERE problem_path = ?")
            .bind(self.path.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        problems
    }
    async fn get_user_id(&self, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow{
        let user_id = sqlx::query("SELECT user_id FROM users WHERE session = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        user_id
    }
    async fn check_if_solved(&self, pool: &State<sqlx::MySqlPool>) -> Result<sqlx::mysql::MySqlRow, String> {
        let solved = sqlx::query("SELECT code FROM solved WHERE user_id = ? AND problem_id = ?")
            .bind(self.path.clone())
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await;
        match solved {
            Ok(solved) => Ok(solved),
            Err(_) => Err(String::from("None")),
        }
    }
    pub async fn get_problem(&self, pool: &State<sqlx::MySqlPool>) -> LoadProblem{
        let problem = self.get_problem_data(pool).await;
        let (name, text, input, expected) = 
        (problem.get("name"), problem.get("text"), problem.get("ex_input"), problem.get("ex_output"));
        let code = match self.check_if_solved(pool).await {
            Ok(code) => code.get("code"),
            Err(_) => String::from("None"),
        };
        let return_json = LoadProblem {
            name: name,
            text: text,
            ex_input: input,
            ex_expected: expected,
            code: code
        };
        return_json
    }
}