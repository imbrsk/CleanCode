use rocket::State;
use serde::{Deserialize, Serialize};
use sqlx::{mysql::MySqlRow, Row};

#[derive(Deserialize, Serialize)]
pub struct AddProblemIntoTest{
    name: String,
    problem_path: String,
    subject: String,
    path: String,
    year: String,
    period: String,
    text: String,
    ex_input: String,
    ex_output: String,
    input: String,
    expected: String,
    starting_code: String,
    test_case_number: String
}
impl AddProblemIntoTest{
    pub async fn add_to_test_database(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO subjects_dev (name, problem_path, subject, path, year, period, text, ex_input, ex_output, input, expected, starting_code, test_case_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(&self.name)
            .bind(&self.problem_path)
            .bind(&self.subject)
            .bind(&self.path)
            .bind(&self.year)
            .bind(&self.period)
            .bind(&self.text)
            .bind(&self.ex_input)
            .bind(&self.ex_output)
            .bind(&self.input)
            .bind(&self.expected)
            .bind(&self.starting_code)
            .bind(&self.test_case_number)
            .execute(&**pool)
            .await
            .unwrap();
    }
}

#[derive(Deserialize, Serialize)]
pub struct LoadTestDB{
    problem: String,
    id: String
}
impl LoadTestDB {
    pub async fn load_problem_names(pool: &State<sqlx::MySqlPool>) -> Vec<LoadTestDB> {
        let names = sqlx::query("SELECT name,id FROM subjects_dev")
            .fetch_all(&**pool)
            .await
            .unwrap();
        let mut names_vec: Vec<LoadTestDB> = Vec::new();
        for name in names {
            let neme_temp: String = name.get("name");
            let id : i32 = name.get("id");
            let temp = LoadTestDB {
                problem: neme_temp,
                id: id.to_string()
            };
            names_vec.push(temp);
        }
        names_vec
    }
}

#[derive(Deserialize, Serialize)]
pub struct LoadPrblemTest{
    name: String,
}
impl LoadPrblemTest{
    async fn get_problem(&self, pool: &State<sqlx::MySqlPool>) -> MySqlRow{
        let problem = sqlx::query("SELECT * FROM subjects_dev WHERE id = ?")
            .bind(self.name.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        problem
    }
    pub async fn load_problem(&self, pool: &State<sqlx::MySqlPool>) -> (AddProblemIntoTest, String){
        let problem = LoadPrblemTest::get_problem(&self, pool).await;
        let year : i32 = problem.get("year");
        let test_case_number: i32 = problem.get("test_case_number");
        let prooblem = AddProblemIntoTest{
            name: problem.get("name"),
            problem_path: problem.get("problem_path"),
            subject: problem.get("subject"),
            path: problem.get("path"),
            year: year.to_string(),
            period: problem.get("period"),
            text: problem.get("text"),
            ex_input: problem.get("ex_input"),
            ex_output: problem.get("ex_output"),
            input: problem.get("input"),
            expected: problem.get("expected"),
            starting_code: problem.get("starting_code"),
            test_case_number: test_case_number.to_string(),
        };
        let id: i32 = problem.get("id");
        (prooblem, id.to_string())
    }
}

#[derive(Deserialize, Serialize)]
pub struct ChangeProblem{
    name: String,
    problem_path: String,
    subject: String,
    path: String,
    year: String,
    period: String,
    text: String,
    ex_input: String,
    ex_output: String,
    input: String,
    expected: String,
    starting_code: String,
    test_case_number: String,
    id: String
}
impl ChangeProblem{
    pub async fn change_problem(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("UPDATE subjects_dev SET name = ?, problem_path = ?, subject = ?, path = ?, year = ?, period = ?, text = ?, ex_input = ?, ex_output = ?, input = ?, expected = ?, starting_code = ?, test_case_number = ? WHERE id = ?")
            .bind(&self.name)
            .bind(&self.problem_path)
            .bind(&self.subject)
            .bind(&self.path)
            .bind(&self.year)
            .bind(&self.period)
            .bind(&self.text)
            .bind(&self.ex_input)
            .bind(&self.ex_output)
            .bind(&self.input)
            .bind(&self.expected)
            .bind(&self.starting_code)
            .bind(&self.test_case_number)
            .bind(&self.id)
            .execute(&**pool)
            .await
            .unwrap();
    }
}

#[derive(Deserialize, Serialize)]
pub struct MoveToMain{
    id: String
}

impl MoveToMain{
    pub async fn move_to_main(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO subjects (name, problem_path, subject, path, year, period, text, ex_input, ex_output, input, expected, starting_code, test_case_number) SELECT name, problem_path, subject, path, year, period, text, ex_input, ex_output, input, expected, starting_code, test_case_number FROM subjects_dev WHERE id = ?")
            .bind(&self.id)
            .execute(&**pool)
            .await
            .unwrap();
        sqlx::query("DELETE FROM subjects_dev WHERE id = ?")
            .bind(&self.id)
            .execute(&**pool)
            .await
            .unwrap();
    }
}
pub struct LoadMainDB;
impl LoadMainDB{
    pub async fn load_problem_names(pool: &State<sqlx::MySqlPool>) -> Vec<String>{
        let names = sqlx::query("SELECT name FROM subjects")
            .fetch_all(&**pool)
            .await
            .unwrap();
        let mut names_vec: Vec<String> = Vec::new();
        for name in names{
            let temp_name: String = name.get::<String, _>("name");
            names_vec.push(temp_name);
        }
        names_vec
    }
}

#[derive(Deserialize, Serialize)]
pub struct LoadPrblemMain{
    name: String
}
impl LoadPrblemMain{
    async fn get_problem(&self, pool: &State<sqlx::MySqlPool>) -> MySqlRow{
        let problem = sqlx::query("SELECT * FROM subjects WHERE name = ?")
            .bind(self.name.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        problem
    }
    pub async fn load_problem(&self, pool: &State<sqlx::MySqlPool>) -> (AddProblemIntoTest, String){
        let problem = LoadPrblemMain::get_problem(&self, pool).await;
        let year : i32 = problem.get("year");
        let test_case_number: i32 = problem.get("test_case_number");
        let prooblem = AddProblemIntoTest{
            name: problem.get("name"),
            problem_path: problem.get("problem_path"),
            subject: problem.get("subject"),
            path: problem.get("path"),
            year: year.to_string(),
            period: problem.get("period"),
            text: problem.get("text"),
            ex_input: problem.get("ex_input"),
            ex_output: problem.get("ex_output"),
            input: problem.get("input"),
            expected: problem.get("expected"),
            starting_code: problem.get("starting_code"),
            test_case_number: test_case_number.to_string(),
        };
        let id: i32 = problem.get("id");
        (prooblem, id.to_string())
    }
}

#[derive(Deserialize, Serialize)]
pub struct ChangeProblemMain{
    name: String,
    problem_path: String,
    subject: String,
    path: String,
    year: String,
    period: String,
    text: String,
    ex_input: String,
    ex_output: String,
    input: String,
    expected: String,
    starting_code: String,
    test_case_number: String,
    id: String
}
impl ChangeProblemMain{
    pub async fn change_problem(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("UPDATE subjects SET name = ?, problem_path = ?, subject = ?, path = ?, year = ?, period = ?, text = ?, ex_input = ?, ex_output = ?, input = ?, expected = ?, starting_code = ?, test_case_number = ? WHERE id = ?")
            .bind(&self.name)
            .bind(&self.problem_path)
            .bind(&self.subject)
            .bind(&self.path)
            .bind(&self.year)
            .bind(&self.period)
            .bind(&self.text)
            .bind(&self.ex_input)
            .bind(&self.ex_output)
            .bind(&self.input)
            .bind(&self.expected)
            .bind(&self.starting_code)
            .bind(&self.test_case_number)
            .bind(&self.id)
            .execute(&**pool)
            .await
            .unwrap();
    }
}
#[derive(Deserialize, Serialize)]
pub struct LoadProblemDB{
    name: String,
    text: String,
    ex_input: String,
    ex_expected: String,
    code: String,
} 
#[derive(Deserialize, Serialize)]
pub struct LoadDB{
    name: String,
}
impl LoadDB{
    async fn get_problem_data(&self, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow{
        let problems = sqlx::query("SELECT name, text, ex_input, ex_output, starting_code FROM subjects_dev WHERE name = ?")
            .bind(&self.name)
            .fetch_one(&**pool)
            .await
            .unwrap();
        problems
    }
    pub async fn get_problem(&self, pool: &State<sqlx::MySqlPool>) -> LoadProblemDB{
        let problem = self.get_problem_data(pool).await;
        let (name, text, input, expected, code) = 
        (problem.get("name"), problem.get("text"), problem.get("ex_input"), problem.get("ex_output"), problem.get("starting_code"));
        let return_json = LoadProblemDB {
            name: name,
            text: text,
            ex_input: input,
            ex_expected: expected,
            code: code
        };
        return_json
    }
}
