use reqwest::get;
use rocket::{get, launch, options, post, response, routes, State};
use rocket::fairing::AdHoc;
use rocket::serde::json::Json;
use rocket_cors::CorsOptions;
use serde_json::json;
use sqlx::MySqlPool;
use uuid::Uuid;


mod login_register;
mod leaderboard;
use crate::login_register::User;
use login_register::{AccountStatusLogin, AccountStatusRegister};

mod runcode;
use crate::runcode::ProblemData;
use crate::leaderboard::Leaderboard;    

mod create_session;
use crate::create_session::LoginData;

mod verify_session;
use crate::verify_session::Token;

mod get_username;
use crate::get_username::Session;
#[rocket::post("/login", data = "<data>")]
async fn login(data: Json<User>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _response = match data.login(&pool).await {
        AccountStatusLogin::Logged =>{
        let create_cookie = LoginData {
                email: data.email.clone(),
                remember_me: data.remember_me.unwrap_or(false), 
            };
            let cookie = create_cookie.create_session(&pool).await;
        return Json(json!({
            "status": "success",
            "message": "User logged in successfully",
            "cookie": *cookie
        }))
        },
        AccountStatusLogin::EmailNotValid => return Json(json!({
        "status": "error",
        "message": "Email is not valid"
        })), 
        AccountStatusLogin::IncorrectPassword => return Json(json!({
        "status": "error",
        "message": "Incorrect password"
        })),
    };
}
#[post("/register", data = "<data>")]
async fn register(data: Json<User>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _response = match data.register(&pool).await {
        AccountStatusRegister::Created => return Json(json!({
            "status": "success",
            "message": "Account created"
        })),
        AccountStatusRegister::EmailTaken => return Json(json!({
        "status": "error",
        "message": "Email is taken"
        })), 
        AccountStatusRegister::UsernameTaken => return Json(json!({
        "status": "error",
        "message": "Username is taken"
        })),
    };
}
#[options("/register")]
fn reg()->String{
    String::from("bobo")
}
#[post("/execute", data = "<data>")]
async fn execute(data: Json<ProblemData>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
        let temp = data.make_code_req(pool).await;
        temp
}
#[post("/session", data = "<data>")]
async fn session(data: Json<Token>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
        let session = data.create_session(pool).await;
        Json(json!({
        "session": session
        }))
}
#[post("/getuser", data = "<data>")]
async fn getuser(data: Json<Session>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
        let user = data.get_user_id(pool).await;
        print!("{:?}", user);
        user
}
/*#[get("/leaderboard")]
async fn get_table(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> { 
    let cookie = bobo.create_session(pool).await; 
    cookie
}*/
#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::on_ignite("MySQL DB", |rocket| async {
            let pool = MySqlPool::connect("mysql://root:bobo2004@localhost:3306/userdata").await.unwrap();
            rocket.manage(pool)
        }))
        .attach(CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![login, register, execute, session, getuser])
}
