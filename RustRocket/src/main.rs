use reqwest::get;
use rocket::{data, get, launch, options, post, response, routes, State};
use rocket::fairing::AdHoc;
use rocket::serde::json::Json;
use rocket_cors::CorsOptions;
use serde_json::json;
use sqlx::MySqlPool;



mod login_register;
mod leaderboard;
use crate::login_register::User;
use crate::subjects::{GetProblem, Subject};
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

mod reset_password;
use crate::reset_password::{ResetPassword, Reset, VerifyCode, Verify};

mod subjects;
use subjects::{LoadProblem, Path, SubjectName, Subjects};


mod verify;
use verify::{VerifyEmail, ResetEmail, VerifyCodeEmail};


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
#[post("/verify_email", data = "<data>")]
async fn verify_email(data: Json<VerifyEmail>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    if data.status == "email" {
        let _response = match data.send_verify_code(&pool).await {
            ResetEmail::EmailTaken => return Json(json!({
                "status": "error",
                "message": "Email is taken"
            })),
            ResetEmail::Send => return Json(json!({
                "status": "success",
            })),
        };
    }
    else if data.status == "verify" {
        let _response = match data.verify_code(pool).await {
            VerifyCodeEmail::Correct => return Json(json!({
                "status": "success",
            })),
            VerifyCodeEmail::NotCorrect=> return Json(json!({
                "status": "error",
                "message": "Code in not correct"
            })),
        };
    }
    else {
        return Json(json!({
            "status": "error",
            "message": "Invalid status"
        }))
    }
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
        Json(json!({ 
            "username": user.0, 
            "solved": user.1 
        }))
}
#[post("/check_email", data = "<data>")]
async fn check_email(data: Json<ResetPassword>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _response = match data.reset_password(pool).await {
        Reset::Send => return Json(json!({
            "status": "success",
            "message": "Reset code sent"
        })),
        Reset::EmailNotValid => return Json(json!({
            "status": "error",
            "message": "Email is not valid"
        })),
    };
}
#[post("/verify_code", data = "<data>")]
async fn verify_code(data: Json<VerifyCode>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _ = match data.reset(pool).await{
        Verify::CodeNotValid => return Json(json!({
            "status": "error",
            "message": "Code is not valid"
        })),
        Verify::CodeValid => return Json(json!({
            "status": "success",
        })),
        Verify::TimeExceeded => return Json(json!({
            "status": "error",
            "message": "Code is expired"
        })),
    };
}
#[post("/reset", data = "<data>")]   
async fn reset(data: Json<User>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    data.reset_password(pool).await;
    Json(json!({
        "status": "success",
        "message": "Password reset"
    }))
}
#[get("/subjects")]
async fn subject(pool: &State<sqlx::MySqlPool>) -> Json<Vec<Subjects>> {
    let temp = Subjects::get_subjects(pool).await;
    temp
}
#[post("/subject_problem", data = "<data>")]
async fn subject_problem(data: Json<Subject>, pool: &State<sqlx::MySqlPool>) -> Json<Vec<SubjectName>>{
    let return_t = data.get_problems(pool).await;
    Json(return_t)
}
#[get("/get_routs")]
async fn get_routs(pool: &State<sqlx::MySqlPool>) -> Json<Vec<Path>> {
    let paths = Path::get_paths(pool).await;
    Json(paths)
}
#[post("/load_problem", data = "<data>")]
async fn load_problem(data: Json<GetProblem>, pool: &State<sqlx::MySqlPool>) -> Json<LoadProblem> {
    let loaded_problem = data.get_problem(pool).await;
    Json(loaded_problem)
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
        .mount("/", routes![login, register, execute, session, getuser, check_email, reset, verify_code, subject, verify_email, subject_problem, get_routs, load_problem])
}
