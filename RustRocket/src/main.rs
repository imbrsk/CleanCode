use rocket::{post, serde::json::Json};
use rocket::{get, launch, routes};
use rocket::fairing::AdHoc;
use sqlx::MySqlPool;
use rocket::State;
use serde_json::json;

#[get("/get")]
fn index(pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    Json(json!({ "users": "da".to_string() }))
}

#[post("/login", data = "<data>")]
async fn login(pool: &State<sqlx::MySqlPool>, data: Json<serde_json::Value>) -> Json<serde_json::Value> {
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
    print!("{}",data["password"].clone().to_string());
    if cor.0 == data["password"].clone().to_string().trim_matches('"'){
        return Json(json!({ "users": "logged".to_string() })) ;
    }
    Json(json!({ "users": "wrong".to_string() })) 
}

#[post("/register", data = "<data>")]
async fn register(pool: &State<sqlx::MySqlPool>, data: Json<serde_json::Value>) -> Json<serde_json::Value> {

    let mut taken: (i64,);
    taken = sqlx::query_as("SELECT COUNT(*) FROM users WHERE username = ?")
            .bind(data["user"].clone().to_string().trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
    if taken.0 == 1{
        return Json(json!({ "response": "utaken".to_string() })) ;
    }
    taken = sqlx::query_as("SELECT COUNT(*) FROM users WHERE email = ?")
            .bind(data["email"].clone().to_string().trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
    if taken.0 == 1{
        return Json(json!({ "response": "etaken".to_string() })) ;
    }
    
    sqlx::query("INSERT INTO users (username, email, pass) VALUES (?,?, MD5(?))")
        .bind(data["user"].clone().to_string().trim_matches('"'))
        .bind(data["email"].clone().to_string().trim_matches('"'))
        .bind(data["password"].clone().to_string().trim_matches('"'))
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
