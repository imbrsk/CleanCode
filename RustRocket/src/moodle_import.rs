use rocket::{figment::providers, State};
use serde::{Deserialize, Serialize};
use sqlx::{mysql::MySqlRow, Row};
use quickxml_to_serde::{xml_string_to_json, Config, NullValue}; 
mod add_problem;
use crate::AddProblemIntoTest;

pub struct MoodleImport;

impl MoodleImport{
    pub async fn add_problems(data: serde_json::Value, pool: &State<sqlx::MySqlPool>){
        let xml_data: &str = data["fileContent"].as_str().unwrap();
        let conf = Config::new_with_defaults();
        let json = xml_string_to_json(xml_data.to_owned(), &conf).unwrap();
        let mut track = false;
        let problems = json["quiz"]["question"].as_array().unwrap();
        for problem in problems{
            if track{
            let name = problem["name"]["text"].as_str().unwrap();
            let text = problem["questiontext"]["text"].as_str().unwrap();
            let mut test_cases_stdin: String = "{".to_string();
            let mut test_cases_expected: String = "{".to_string();
            let test_cases = problem["testcases"]["testcase"].as_array().unwrap();
            let mut ex_stdin: String = "".to_string();
            let mut ex_expected: String = "".to_string();
            let mut j = 0; 
            for test_case in test_cases {
                let stdin =  &test_case["stdin"]["text"];
                let expected = &test_case["expected"]["text"];
                print!("{:?}",expected.to_string().as_str());
                if j == 0 {
                    ex_stdin.push_str(stdin.to_string().as_str());
                    ex_expected.push_str(expected.to_string().as_str());
                }
                test_cases_stdin.push_str(format!("\"test{}\": \"{}\",", j.to_string(), stdin.to_string()).as_str()); 
                test_cases_expected.push_str(format!("\"test{}\": \"{}\",", j.to_string(), expected.to_string()).as_str()); 
                j+=1; 
            }
            test_cases_stdin.truncate(test_cases_stdin.len() - 1);
            test_cases_expected.truncate(test_cases_expected.len() - 1);
            test_cases_stdin.push_str("}");
            test_cases_expected.push_str("}");
            let problem = AddProblemIntoTest{
                name: name.to_string(),
                problem_path: format!("/{}", name.replace(" ", "_")).to_string(),
                subject: data["params"]["subject"].as_str().unwrap().to_string(), 
                path: data["params"]["path"].as_str().unwrap().to_string(),
                year: data["params"]["year"].as_str().unwrap().to_string(),
                period: data["params"]["period"].as_str().unwrap().to_string(),
                text: text.to_string(),
                ex_input: ex_stdin,
                ex_output: ex_expected,
                input: test_cases_stdin,
                expected: test_cases_expected,
                starting_code: problem["answerpreload"].to_string(),
                test_case_number: j.to_string()
            };
            problem.add_to_test_database(&pool).await;
        }else{
            track = true;
        }
    }
    }
}