use rocket::{post, serde::json::Json};
use rocket::{launch, routes};
use rocket_cors::{AllowedOrigins, CorsOptions};

#[derive(serde::Deserialize)]
struct RequestData {
    field1: String,
    field2: i32,
}

#[derive(serde::Serialize)]
struct ResponseData {
    message: String,
}

#[post("/process_json", data = "<data>")]
fn process_json(data: Json<RequestData>) -> Json<ResponseData> {
    let field1_value = &data.field1;
    let field2_value = data.field2+1;
    let response_data = ResponseData {
        message: format!("Received data: {} and {}", field1_value, field2_value),
    };
    Json(response_data)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(rocket_cors::CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![process_json])
}
