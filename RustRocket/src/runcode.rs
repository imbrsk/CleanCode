use std::fmt::format;
use reqwest::{self, dns::Resolve};
use rocket::{response, serde::json::Json, FromForm, State};
use serde::Deserialize;
use serde_json::json;

enum ProcessCodeResponse{
    Success,
    CompileError,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct ProblemData{
    code: String,
    language: i8,
    user: String,
    subject: String,
    problem: String,
}
impl ProblemData{
    async fn make_api_req(payload: serde_json::Value)->Result<Json<serde_json::Value>, reqwest::Error> {
        let client = reqwest::Client::new();
        match client.post("http://localhost:2358/submissions")
            .json(&payload)
            .query(&[("base64_encoded", "false"), ("wait", "true"), ("fields", "stdout,status")])
            .send()
            .await
        {
            Ok(response) => {
                let text = response.text().await?;
                Ok(Json(serde_json::from_str(&text).unwrap()))
            }
            Err(e) => {
                eprintln!("Failed to send request: {}", e);
                Err(e)
            }
        }
    }
    async fn check_error(data: serde_json::Value) -> ProcessCodeResponse{
        let response = ProblemData::make_api_req(data).await.unwrap().0;
        if response["status"]["description"].to_string().trim_matches('"') == String::from("Compilation Error"){
            return ProcessCodeResponse::CompileError;
        }else{
            return ProcessCodeResponse::Success;
        }
    }
    async fn get_input_expected(&self, field : String , pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
        let sent_data = format!("SELECT {} FROM subjects WHERE problem_name = ?", field);
        let correct = sqlx::query_as::<_,   (serde_json::Value,)>(&sent_data)
            .bind(self.problem.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        rocket::serde::json::Json(correct.0)
    }
    pub async fn make_code_req(&self,  pool: &State<sqlx::MySqlPool>)-> Json<serde_json::Value>{
        let mut payload = json!({
            "language_id": self.language.clone(),
            "source_code": self.code.clone(),
            "stdin": "",
            "expected_output": ""
        });
        let _response = match ProblemData::check_error(payload.clone()).await{
                ProcessCodeResponse::CompileError => 
                    return Json(json!({
                "status": "Compilation Error",
                })) 
                ,
                ProcessCodeResponse::Success => { 
                    let input = self.get_input_expected(String::from("input"), pool).await;
                    let expected = self.get_input_expected(String::from("expected"), pool).await;
                    let mut submission_data = json!({});
                    let mut cor_data = json!({});
                    let mut track_cor:i8 = 0;
                    for i in 0i8..10 {
                        let temp = format!("test{}", i);
                        payload["stdin"] = input[&temp].clone();
                        payload["expected_output"] = expected[&temp].clone();
                        let response = ProblemData::make_api_req(payload.clone()).await.unwrap().0;
                        submission_data[&temp] = response["stdout"].clone();
                        if response["status"]["description"] == "Wrong Answer" {
                            cor_data[temp] = "0".into();
                        } else {
                            track_cor+=1;
                            cor_data[temp] = "1".into();
                        }
                    }
                    drop(payload);
                    return Json(json!({
                "inpit": *input,
                "expected": *expected,
                "got": submission_data,
                "is_cor": cor_data,
                "track_cor": track_cor
                })) } 
        };
    }
}
