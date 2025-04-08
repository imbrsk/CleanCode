use reqwest::{self};
use rocket::tokio;
use rocket::{serde::json::Json, FromForm, State};
use serde::Deserialize;
use serde_json::json;
use futures::stream::FuturesUnordered;
use futures::stream::StreamExt;
use std::str;
use base64::{Engine as _, engine::general_purpose};

enum ProcessCodeResponse{
    Success,
    CompileError,
    RuntimeError,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct ProblemDataDev{
    pub code: String,
    language: String,
    name: String,
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
    async fn check_error(data: serde_json::Value, is_error: bool) -> (ProcessCodeResponse, String){
        let response = ProblemDataDev::make_api_req(data).await.unwrap().0;
        let mut error: String = String::new();
        if is_error{
            print!("{}\n", response["compile_output"].to_string().replace("\"", ""));
            let lines: Vec<String> = response["compile_output"].to_string().replace("\"", "").split("\\n")
                .map(|part| part.to_string())
                .collect();
            error = String::new();

            for line in lines{
                let decoded = general_purpose::STANDARD.decode(line.clone());
                match decoded {
                    Ok(decoded) => {
                        let decoded_str = String::from_utf8_lossy(&decoded);
                        error.push_str(&decoded_str);
                    },
                    Err(e) => {
                        println!("Error: {:?}", e);
                    }
                }
            }
        }
        if response["status"]["description"].to_string().trim_matches('"') == String::from("Compilation Error"){
            return (ProcessCodeResponse::CompileError, error);
        }else if response["status"]["description"].to_string().trim_matches('"') == String::from("Runtime Error (NZEC)"){
            return (ProcessCodeResponse::RuntimeError,error);
        
        }else{
            return (ProcessCodeResponse::Success,"".to_string());
        }
    }
    async fn get_input_expected(&self, field : String , pool: &State<sqlx::MySqlPool>) -> String{
        let sent_data = format!("SELECT {} FROM subjects_dev WHERE name = ?", field);
        let correct:(String, ) = sqlx::query_as(&sent_data)
            .bind(self.name.clone())    
            .fetch_one(&**pool)
            .await
            .unwrap();
        correct.0
    }
    async fn get_test_case_num(&self, pool: &State<sqlx::MySqlPool>) -> i8{
        let sent_data = "SELECT test_case_number FROM subjects_dev WHERE name = ?";
        let correct:(i8, ) = sqlx::query_as(&sent_data)
            .bind(self.name.clone())    
            .fetch_one(&**pool)
            .await
            .unwrap();
        correct.0
    }
    pub async fn make_code_req(&self,  pool: &State<sqlx::MySqlPool>)-> Json<serde_json::Value>{
        let mut payload = json!({
            "language_id": self.language.clone(),
            "source_code": general_purpose::STANDARD.encode(self.code.clone()),
            "stdin": general_purpose::STANDARD.encode(""),
            "expected_output": general_purpose::STANDARD.encode("")
        });
        let _response = match ProblemDataDev::check_error(payload.clone(), false).await.0{
                ProcessCodeResponse::CompileError => 
                    return Json(json!({
                "status": ProblemDataDev::check_error(payload.clone(), true ).await.1,
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
                    let test_cases = self.get_test_case_num(pool).await;
                    let mut futures = FuturesUnordered::new();  
                    for i in 0i8..test_cases {
                        let temp = format!("test{}", i);
                        if let Ok(ref value) = input_value {
                            let test = value.get(&temp);
                            if let Some(test_str) = test.as_ref().and_then(|v| v.as_str()) {
                                payload["stdin"] = serde_json::Value::String(general_purpose::STANDARD.encode(test_str));
                            }
                        }   
                        if let Ok(ref value1) = expected_value {
                            let test = value1.get(&temp);
                            if let Some(test_str) = test.as_ref().and_then(|v| v.as_str()) {
                                payload["expected_output"] = serde_json::Value::String(general_purpose::STANDARD.encode(test_str));
                            }
                        } 
                        let payload_clone = payload.clone();
                        let future = tokio::spawn(async move {
                            ProblemDataDev::make_api_req(payload_clone).await.unwrap()
                        });
                        futures.push(future);
                    }
                    let mut i:i8 =0;
                    while let Some(res) = futures.next().await {
                        let response: serde_json::Value = res.unwrap().into_inner();
                        let temp = format!("test{}", i);
                        let stdout_str = response["stdout"].to_string();
                        let mut stdout: String = String::new();
                        let lines: Vec<String> = stdout_str.to_string().split("\\n")
                            .map(|part| part.to_string())
                            .collect();
                        for line in lines{
                            let decoded = general_purpose::STANDARD.decode(line.replace("\"","").clone());
                            match decoded {
                                Ok(decoded) => {
                                    stdout.push_str(&String::from_utf8(decoded).unwrap());
                                },
                                Err(e) => {
                                    println!("Error: {:?}", e);
                                }
                            }
                        }
                        
                        submission_data[&temp] = serde_json::Value::String(stdout); 
                        if response["status"]["description"] == "Wrong Answer" {
                            cor_data[temp] = "0".into();
                        } else {
                            track_cor+=1;
                            cor_data[temp] = "1".into();
                        }
                        i+=1;
                    }
                    let is_cor: bool = if track_cor == test_cases {
                        true
                    } else {
                        false
                    };
                        return Json(json!({
                    "input": input_value.unwrap(),
                    "expected": expected_value.unwrap(),
                    "got": submission_data,
                    "is_cor": cor_data,
                    "track_cor": is_cor
                    })) } 
        };
    }
}
