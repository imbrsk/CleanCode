use rocket::{post, serde::json::Json};
use rocket::{get, launch, response, routes, FromForm};
use rocket::fairing::AdHoc;
use serde::Deserialize;
use serde_json::json;
use sqlx::MySqlPool;
use rocket::State;
use rocket_cors::CorsOptions;
enum AccountStatusLogin {
    Logged,
    EmailNotValid,
    IncorrectPassword,
}
enum AccountStatusRegister {
    Created,
    EmailTaken,
    UsernameTaken,
}
#[derive(Debug, FromForm, Deserialize)]
struct User{
    username: String,
    email: String,
    password: String,
}
impl User{
    async fn is_user(data: String, type_data: String,login_register: bool, pool: &State<sqlx::MySqlPool>) -> bool {
        let query = format!("SELECT COUNT(*) FROM users WHERE {} = ?", type_data);
        let taken: (i8, )= sqlx::query_as(&query)
            .bind(&data)
            .fetch_one(&**pool)
            .await
            .unwrap();
        if login_register{
            if taken.0 == 1 {
                return false;
            }else{
                return true;
            }
        }
        taken.0 == 1
    }
    async fn password_match(email: String, pass: String, pool: &State<sqlx::MySqlPool>) -> bool{
        let correct = sqlx::query_as::<_, (String,)>("SELECT pass FROM users WHERE email = ?;")
            .bind(email.trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
        correct.0 != pass
    }
    async fn create_account(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO users (username, email, pass) VALUES (?,?,?)")
        .bind(self.username.clone())
        .bind(self.email.clone())
        .bind(self.password.clone())
        .execute(pool.inner())
        .await
        .unwrap();
    print!("{}","bet");
    }
    async fn login(&self, pool: &State<sqlx::MySqlPool>) -> AccountStatusLogin {
        if User::is_user(self.email.clone(), String::from("email"),true, pool).await{
            return AccountStatusLogin::EmailNotValid;
        } 
        if User::password_match(self.email.clone(),self.password.clone(), pool).await{
            return AccountStatusLogin::IncorrectPassword;
        }
        AccountStatusLogin::Logged
    }
    async fn register(&self, pool: &State<sqlx::MySqlPool>) -> AccountStatusRegister {
        if User::is_user(self.email.clone(), String::from("email"),false, pool).await {
            return AccountStatusRegister::EmailTaken;
        } 
        if User::is_user(self.username.clone(), String::from("username"),false, pool).await {
            return AccountStatusRegister::UsernameTaken;
        } 
        self.create_account(pool).await;
        AccountStatusRegister::Created
    }
}

#[post("/login", data = "<data>")]
async fn login(data: Json<User>, pool: &State<sqlx::MySqlPool>) -> Json<serde_json::Value> {
    let _response = match data.login(&pool).await {
        AccountStatusLogin::Logged => return Json(json!({
        "status": "success",
        "message": "User logged in successfully"
        })),
        AccountStatusLogin::EmailNotValid=> return Json(json!({
        "status": "error",
        "message": "Email is not valid"
        })), 
        AccountStatusLogin::IncorrectPassword=> return Json(json!({
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
        AccountStatusRegister::EmailTaken=> return Json(json!({
        "status": "error",
        "message": "Email is taken"
        })), 
        AccountStatusRegister::UsernameTaken=> return Json(json!({
        "status": "error",
        "message": "Username taken"
        })),
    };
}

#[launch]
fn rocket() -> _ {
        rocket::build()
        .attach(AdHoc::on_ignite("MySQL DB", |rocket| async {
            let pool = MySqlPool::connect("mysql://root:bobo2004@localhost:3306/userdata").await.unwrap();
            rocket.manage(pool)
        }))
        .attach(CorsOptions::default().to_cors().expect("Failed to create CORS configuration"))
        .mount("/", routes![login, register])
    }
