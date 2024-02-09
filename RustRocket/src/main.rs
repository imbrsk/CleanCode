
//mod runcode;
pub mod structs;

use rocket::{post, serde::json::Json};
use rocket::{get, launch, routes};
use rocket::fairing::AdHoc;
use sqlx::MySqlPool;
use rocket::State;
use serde_json::json;
use sqlx::FromRow;

#[derive(serde::Serialize)]
#[derive(FromRow)]
struct User {
    user_id: i32,
    username: String,
    email: String,
    pass: String,
}
#[get("/get")]
async fn index(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let rows: Vec<User> = sqlx::query_as("SELECT * FROM users;")
        .fetch_all(pool.inner()).await.unwrap();
    Json(json!({ "users": rows }))
}

#[post("/process_json", data = "<data>")]
fn process_json(data: Json<structs::RequestData>) -> Json<structs::ResponseData> {
   let numbers: Vec<String> = (1..=10).map(|i| i.to_string()).collect();

    let return_v = structs::ResponseData{
        message: numbers
    };

    Json(return_v)
}

#[launch]
fn rocket() -> _ {
        rocket::build()
        .attach(AdHoc::on_ignite("MySQL DB", |rocket| async {
            let pool = MySqlPool::connect("mysql://root:bobo2004@localhost:3306/userdata").await.unwrap();
            rocket.manage(pool)
        }))
        .attach(rocket_cors::CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![process_json, index])
}
