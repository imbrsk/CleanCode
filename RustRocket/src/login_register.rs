use rocket::{FromForm, State};
use serde::Deserialize;
use bcrypt::{hash, verify};

pub enum AccountStatusLogin {
    Logged,
    EmailNotValid,
    IncorrectPassword,
}
pub enum AccountStatusRegister {
    Created,
    EmailTaken,
    UsernameTaken,
}
#[derive(Debug, FromForm, Deserialize)]
pub struct User{
    username: String,
    email: String,
    password: String,
}
impl User{
    async fn is_user(data: String, type_data: String,login_register: bool, pool: &State<sqlx::MySqlPool>) -> bool {
        let query = format!("SELECT COUNT(*) FROM users WHERE {} = ?", type_data);
        let taken: (i8, )= sqlx::query_as(&query)
            .bind(data)
            .fetch_one(&**pool)
            .await
            .unwrap();
        if login_register{
            if taken.0 == 1 {
                return false;
            }
            return true;
        }
        taken.0 == 1
    }
    async fn password_match(email: String, pass: String, pool: &State<sqlx::MySqlPool>) -> bool{
        let hashed_password = sqlx::query_as::<_, (String,)>("SELECT pass FROM users WHERE email = ?;")
            .bind(email.trim_matches('"'))
            .fetch_one(&**pool)
            .await
            .unwrap();
        !verify(pass, &hashed_password.0).unwrap()
    }
    async fn create_account(&self, pool: &State<sqlx::MySqlPool>){
        sqlx::query("INSERT INTO users (username, email, pass, solved) VALUES (?,?,?,0)")
        .bind(self.username.clone())
        .bind(self.email.clone())
        .bind(hash(self.password.clone(), 10).unwrap())
        .execute(pool.inner())
        .await
        .unwrap();
        sqlx::query("CREATE TABLE ? (id INT AUTO_INCREMENT PRIMARY KEY, problem VARCHAR(255), subjects VARCHAR(255), code TEXT);")
        .bind(self.username.clone())
        .execute(pool.inner())
        .await
        .unwrap();
    }
    pub async fn login(&self, pool: &State<sqlx::MySqlPool>) -> AccountStatusLogin {
        if User::is_user(self.email.clone(), String::from("email"),true, pool).await{
            return AccountStatusLogin::EmailNotValid;
        } 
        if User::password_match(self.email.clone(),self.password.clone(), pool).await{
            return AccountStatusLogin::IncorrectPassword;
        }
        AccountStatusLogin::Logged
    }
    pub async fn register(&self, pool: &State<sqlx::MySqlPool>) -> AccountStatusRegister {
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