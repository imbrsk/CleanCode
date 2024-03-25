use rocket::{FromForm, State};
use serde::{Deserialize, Serialize};
use sqlx::Row;

struct AddProblem {
    name: String,
    problem_path: String,
    subject: String,
    path: String,
    year: String,
    period: String,
    text: String,
    ex_input: String,
    ex_output: String,
    input: String,
    output: String,
    starting_code: String,
}
impl AddProblem{

    
}