use std::fmt::format;
use reqwest::{self, dns::Resolve};
use rocket::{response, serde::json::Json, FromForm, State};
use serde::Deserialize;
use serde_json::from_str;
use serde_json::{json, to_value};
use sqlx::Row;

enum ProcessCodeResponse{
    Success,
    CompileError,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct ProblemData{
    code: String,
    language: String,
    session: String,
    path: String,
    problem_id: String,
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
    async fn get_input_expected(&self, field : String , pool: &State<sqlx::MySqlPool>) -> String{
        let sent_data = format!("SELECT {} FROM subjects WHERE id = ? AND path = ?", field);
        let correct:(String, ) = sqlx::query_as(&sent_data)
            .bind(self.problem_id.clone())
            .bind(self.path.clone())    
            .fetch_one(&**pool)
            .await
            .unwrap();
        correct.0
    }
    async fn get_user_id(&self, pool: &State<sqlx::MySqlPool>) -> sqlx::mysql::MySqlRow{
        let user_id = sqlx::query("SELECT user_id FROM sessions WHERE session_id = ?")
            .bind(self.session.clone())
            .fetch_one(&**pool)
            .await
            .unwrap();
        user_id
    }
    async fn save_code(&self ,user_id: i32, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO solved (user_id, problem_id, code) VALUES (?, ?, ?)")
            .bind(user_id.to_string())
            .bind(self.problem_id.clone())
            .bind(self.code.clone())
            .execute(&**pool)
            .await
            .unwrap();
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
                    let input_value: Result<serde_json::Value, _> = serde_json::from_str(&input);
                    let expected_value: Result<serde_json::Value, _> = serde_json::from_str(&expected);
                    for i in 0i8..10 {
                        let temp = format!("test{}", i);
                        if let Ok(ref value) = input_value {
                            let test = value.get(&temp);
                            if let Some(test_str) = test.as_ref().and_then(|v| v.as_str()) {
                                payload["stdin"] = test_str.into();
                            }
                        }   
                        if let Ok(ref value1) = expected_value {
                            let test = value1.get(&temp);
                            if let Some(test_str) = test.as_ref().and_then(|v| v.as_str()) {
                                payload["expected_output"] = test_str.into();
                            }
                        } 
                        let response = ProblemData::make_api_req(payload.clone()).await.unwrap().0;
                        submission_data[&temp] = response["stdout"].clone();
                        if response["status"]["description"] == "Wrong Answer" {
                            cor_data[temp] = "0".into();
                        } else {
                            track_cor+=1;
                            cor_data[temp] = "1".into();
                        }
                    }
                        if track_cor == 10{
                            let user_id = self.get_user_id(pool).await;
                            self.save_code(user_id.get("user_id"), pool).await;
                        }
                        drop(payload);
                        return Json(json!({
                    "input": input_value.unwrap(),
                    "expected": expected_value.unwrap(),
                    "got": submission_data,
                    "is_cor": cor_data,
                    "track_cor": track_cor
                    })) } 
        };
    }
}
