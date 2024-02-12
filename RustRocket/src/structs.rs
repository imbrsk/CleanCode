#[derive(serde::Deserialize)]
pub struct RequestData {
    code: String,
    user: String
   // zadaca: String
}
#[derive(serde::Serialize)]
pub struct ResponseData {
    pub message: String
}
pub struct ResponseGot {
    test0: String, 
}