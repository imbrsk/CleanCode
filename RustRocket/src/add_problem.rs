

struct AddProblemIntoTest {
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
    output: String,
    starting_code: String,
    test_case_numer: String
}
impl AddProblemIntoTest{
    async fn add_to_test_database(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO subjects_dev (name, problem_path, subject, path, year, period, text, ex_input, ex_output, input, output, starting_code, test_case_numer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
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
            .bind(&self.output)
            .bind(&self.starting_code)
            .bind(&self.test_case_numer)
            .execute(&**pool)
            .await;
    }
}

struct LoadTestDB;
impl LoadTestDB{
    async fn load_problem_names(pool: &State<sqlx::MySqlPool>) -> Vec<String>{
        let names = sqlx::query("SELECT name FROM subjects_dev")
            .fetch_all(&**pool)
            .await
            .unwrap();
        let mut names_vec: Vec<String> = Vec::new();
        for name in names{
            names_vec.push(name.get("name"));
        }
        names_vec
    }
}

struct LoadPrblemTest{
    name: String
}
impl LoadPrblemTest{
    async fn get_problem(pool: &State<sqlx::MySqlPool>) -> MySqlRow{
        let problem = sqlx::query("SELECT * FROM subjects_dev WHERE name = ?")
            .bind(self.name.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        problem
    }
    async fn load_problem(&self, pool: &State<sqlx::MySqlPool>) -> (ProblemIntoTest, String){
        let problem = LoadPrblemTest::get_problem(&self, pool).await;
        let prooblem = AddProblemIntoTest{
            name: problem.get("name"),
            problem_path: problem.get("problem_path"),
            subject: problem.get("subject"),
            path: problem.get("path"),
            year: problem.get("year"),
            period: problem.get("period"),
            text: problem.get("text"),
            ex_input: problem.get("ex_input"),
            ex_output: problem.get("ex_output"),
            input: problem.get("input"),
            output: problem.get("output"),
            starting_code: problem.get("starting_code"),
            test_case_numer: problem.get("test_case_numer"),
        };
        (prooblem, problem.get("id"))
    }
}