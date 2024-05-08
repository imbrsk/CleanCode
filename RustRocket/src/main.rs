use admin::{Create, Load};
use rocket::{get, launch, post, routes, State};
use rocket::fairing::AdHoc;
use rocket::serde::json::Json;
use rocket_cors::CorsOptions;
use serde_json::json;
use sqlx::MySqlPool;

mod login_register;
mod leaderboard;
mod admin;
use crate::add_problem::{ChangeProblem, LoadDB, LoadPrblemMain, LoadPrblemTest, MoveToMain};
use crate::admin::Login;
use crate::login_register::User;
use crate::subjects::{GetProblem, Subject};
use login_register::{AccountStatusLogin, AccountStatusRegister};

mod runcode;
use crate::runcode::ProblemData;
use crate::leaderboard::Leaderboard;    

mod create_session;
use crate::create_session::LoginData;

mod verify_session;
use crate::verify_session::{Token, VerifySession};

mod get_username;
use crate::get_username::Session;

mod reset_password;
use crate::reset_password::{ResetPassword, Reset, VerifyCode, Verify};

mod subjects;
use subjects::{LoadProblem, Path, SubjectName, Subjects};


mod verify;
use verify::{VerifyEmail, ResetEmail, VerifyCodeEmail};

mod add_problem;
use add_problem::{AddProblemIntoTest, LoadMainDB, LoadProblemDB, LoadTestDB};

mod runcode_dev;
use runcode_dev::ProblemDataDev;

mod moodle_import;
use moodle_import::MoodleImport;

#[post("/verify_session_cookie", data = "<data>")]
async fn verify_session_cookie(data: Json<VerifySession>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    VerifySession::verify_session_cookie(&data, pool).await
}

#[post("/login", data = "<data>")]
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
        if data.0.code == "" {
            return Json(json!({
                "status": "Code is empty"
            }));
        }
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
#[get("/leaderboard")]
async fn leaderboard_get(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> { 
    let top10 = Leaderboard::get_leaderboard(pool).await; 
    top10
}
#[post("/login_admin", data = "<data>")]
async fn login_admin(data: Json<Login>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _response = match data.login_admin(&pool).await {
        admin::AdminLoginResponse::Logged =>{
        let cookie = data.create_cookie(&pool).await;
            return Json(json!({
                "status": "success",
                "cookie": *cookie
            }))
        },
        admin::AdminLoginResponse::Invalid => return Json(json!({
        "status": "error",
        })),
    };
}
#[get("/load_tokens")]
async fn load_tokens(pool: &State<sqlx::MySqlPool>) -> Json<Vec<admin::Token>> {
    let tokens = Load::get_all_tokens(pool).await;
    Json(tokens)
}
#[get("/create_token")]
async fn create_token(pool: &State<sqlx::MySqlPool>){
    Create::create_token(pool).await;
}
#[post("/delete_token", data = "<data>")]
async fn delete_token(data: Json<admin::DeleteToken>, pool: &State<sqlx::MySqlPool>){
    data.delete_token(pool).await;
}
#[post("/token_login", data = "<data>")]
async fn token_login(data: Json<admin::TokenLogin>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let response = data.login_token(&pool).await;
    response
}
#[post("/verify_admin", data = "<data>")]
async fn verify_admin(data: Json<admin::VerifyAdmin>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let response = data.verify_cookie(&pool).await;
    response
}
#[post("/verify_token", data = "<data>")]
async fn verify_token(data: Json<admin::VerifyToken>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let response = data.verify_cookie(&pool).await;
    response
}
#[post("/add_to_dev", data = "<data>")]
async fn add_to_dev(data: Json<AddProblemIntoTest>, pool: &State<sqlx::MySqlPool>){
    data.add_to_test_database(pool).await;
}
#[get("/load_problem_names_dev")]
async fn load_problem_names_dev(pool: &State<sqlx::MySqlPool>) -> Json<Vec<LoadTestDB>> {
    let names = LoadTestDB::load_problem_names(pool).await;
    Json(names)
}
#[post("/load_problem_test", data = "<data>")]
async fn load_problem_test(data: Json<LoadPrblemTest>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let loaded_problem = data.load_problem(pool).await;
    Json(json!({
        "problem": loaded_problem.0,
        "id": loaded_problem.1
    }))
}
#[post("/edit_problem_test", data = "<data>")]
async fn edit_problem_test(data: Json<ChangeProblem>, pool: &State<sqlx::MySqlPool>){
    data.change_problem(pool).await;
}
#[post("/move_to_main", data = "<data>")]
async fn move_to_main(data: Json<MoveToMain>, pool: &State<sqlx::MySqlPool>){
    data.move_to_main(pool).await;
}
#[get("/load_main_db")]
async fn load_main_db(pool: &State<sqlx::MySqlPool>) -> Json<Vec<String>>{
    let return_v = LoadMainDB::load_problem_names(pool).await;
    Json(return_v)
}
#[post("/load_main_db_problem", data = "<data>")]
async fn load_main_db_problem(data: Json<LoadPrblemMain>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let loaded_problem = data.load_problem(pool).await;
    Json(json!({
        "problem": loaded_problem.0,
        "id": loaded_problem.1
    }))
}
#[post("/edit_problem_main", data = "<data>")]
async fn edit_problem_main(data: Json<ChangeProblem>, pool: &State<sqlx::MySqlPool>){
    data.change_problem(pool).await;
}
#[post("/load_problem_dev", data = "<data>")]
async fn load_problem_dev(data: Json<LoadDB>, pool: &State<sqlx::MySqlPool>) -> Json<LoadProblemDB> {
    let loaded_problem = data.get_problem(pool).await;
    Json(loaded_problem)
}
#[post("/execute_dev", data = "<data>")]
async fn execute_dev(data: Json<ProblemDataDev>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    if data.0.code == "" {
        return Json(json!({
            "status": "Code is empty"
        }));
    }
    let temp = data.make_code_req(pool).await;
    temp
}
#[post("/moodle", data = "<data>")]
async fn moodle(data: Json<serde_json::Value>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
    MoodleImport::add_problems(data.into_inner(), pool).await;
    Json(json!({
        "status": "success"
    }))
}
/*#[post("/solved_user", data = "<data>")]
async fn solved_user(data: Json<serde_json::Value>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value>{
    
}*/

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(AdHoc::on_ignite("MySQL DB", |rocket| async {
            let pool = MySqlPool::connect("mysql://root:bobo2004@localhost:3306/userdata").await.unwrap();
            rocket.manage(pool)
        }))
        .attach(CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![login, register, execute, session, getuser, check_email, reset, verify_code, subject, verify_email,
        subject_problem, get_routs, load_problem, leaderboard_get, login_admin, load_tokens, create_token, delete_token, token_login,
        verify_admin, verify_token, add_to_dev, load_problem_names_dev, load_problem_test, edit_problem_test, move_to_main, load_main_db,
        load_main_db_problem, edit_problem_main, load_problem_dev, execute_dev, moodle, verify_session_cookie])
}