use reqwest::{self};
use rocket::{serde::json::Json, FromForm, State};
use serde::Deserialize;
use serde_json::json;

enum ProcessCodeResponse{
    Success,
    CompileError,
    RuntimeError,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct ProblemDataDev{
    code: String,
    language: String,
    problem_id: String,
}
impl ProblemDataDev{
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
        let response = ProblemDataDev::make_api_req(data).await.unwrap().0;
        if response["status"]["description"].to_string().trim_matches('"') == String::from("Compilation Error"){
            return ProcessCodeResponse::CompileError;
        }else if response["status"]["description"].to_string().trim_matches('"') == String::from("Runtime Error (NZEC)"){
            return ProcessCodeResponse::RuntimeError;
        
        }else{
            return ProcessCodeResponse::Success;
        }
    }
    async fn get_input_expected(&self, field : String , pool: &State<sqlx::MySqlPool>) -> String{
        let sent_data = format!("SELECT {} FROM subjects WHERE id = ?", field);
        let correct:(String, ) = sqlx::query_as(&sent_data)
            .bind(self.problem_id.clone())    
            .fetch_one(&**pool)
            .await
            .unwrap();
        correct.0
    }
    pub async fn make_code_req(&self,  pool: &State<sqlx::MySqlPool>)-> Json<serde_json::Value>{
        let mut payload = json!({
            "language_id": self.language.clone(),
            "source_code": self.code.clone(),
            "stdin": "",
            "expected_output": ""
        });
        let _response = match ProblemDataDev::check_error(payload.clone()).await{
                ProcessCodeResponse::CompileError => 
                    return Json(json!({
                "status": "Compilation Error",
                })), 
                ProcessCodeResponse::RuntimeError => 
                    return Json(json!({
                "status": "Runtime Error",
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
                        let response = ProblemDataDev::make_api_req(payload.clone()).await.unwrap().0;
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
                    "input": input_value.unwrap(),
                    "expected": expected_value.unwrap(),
                    "got": submission_data,
                    "is_cor": cor_data,
                    "track_cor": track_cor
                    })) } 
        };
    }
}
