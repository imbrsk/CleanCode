pub mod structs;
use rocket::{post, serde::json::Json};
use rocket::{get, launch, routes};
use rocket::fairing::AdHoc;
use sqlx::MySqlPool;
use rocket::State;
use serde_json::json;
use rocket::http::{Cookie, CookieJar};

#[get("/get")]
fn index(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    Json(json!({ "users": "da" }))
}

#[post("/login", data = "<data>")]
async fn login(pool: &State<sqlx::MySqlPool>, cookies: &CookieJar<'_>, data: Json<serde_json::Value>) -> Json<serde_json::Value> {
    let taken: (i8, )= sqlx::query_as("SELECT COUNT(*) FROM users WHERE email = ?")
            .bind(data["user"].clone().to_string().trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
    if taken.0 == 0{
        return Json(json!({ "response": "evalid".to_string() })) ;
    }

    let cor = sqlx::query_as::<_, (String,)>("SELECT pass FROM users WHERE email = ?;")
            .bind(data["user"].clone().to_string().trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
    print!("{}",cor.0);
    
/*     if let Some(remember_value) = data.get("remember") {
        if remember_value == "true" {
            let user = data.get("user").as_str().unwrap_or_default().into();
            let cookie = Cookie::new(data.get("user"), "true");
            cookies.add(cookie);
        }
    }*/
    return Json(json!({ "users": "logged".to_string() })) ;
}

#[post("/register", data = "<data>")]
async fn register(pool: &State<sqlx::MySqlPool>, data: Json<serde_json::Value>) -> Json<serde_json::Value> {
    let username = "bsobo21515";
    let password = "BORI";
    let email = "bobo3335";

    let mut taken: (i64,);
    taken = sqlx::query_as("SELECT COUNT(*) FROM users WHERE username = ?")
            .bind(username)
            .fetch_one(&**pool)
            .await
            .unwrap();
    if taken.0 == 1{
        return Json(json!({ "response": "utaken".to_string() })) ;
    }
    taken = sqlx::query_as("SELECT COUNT(*) FROM users WHERE email = ?")
            .bind(email)
            .fetch_one(&**pool)
            .await
            .unwrap();
    if taken.0 == 1{
        return Json(json!({ "response": "etaken".to_string() })) ;
    }
    
    sqlx::query("INSERT INTO users (username, email, pass) VALUES (?,?, MD5(?))")
        .bind(username)
        .bind(email)
        .bind(password)
        .execute(pool.inner())
        .await
        .unwrap();
    return Json(json!({ "users": "registered".to_string() })) ;
}

#[post("/test", data = "<data>")]
async fn test( data: Json<serde_json::Value>) -> Json<serde_json::Value> {
    return Json(json!({ "users": data.get("code") })) ; 
}
#[launch]
fn rocket() -> _ {
        rocket::build()
        .attach(AdHoc::on_ignite("MySQL DB", |rocket| async {
            let pool = MySqlPool::connect("mysql://root:bobo2004@localhost:3306/userdata").await.unwrap();
            rocket.manage(pool)
        }))
        .attach(rocket_cors::CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![register, index, login, test])
}
