use reqwest;
use serde_json::json;

fn make_request() -> Result<(), reqwest::Error> {

    let url = "http://localhost:2358/submissions";
    let payload = json!({
        "language_id": 52,
        "source_code": "#include <iostream>\nusing namespace std;\nint main() {\n   int a;\n   cin>>a;\n   cout<<a;\n    return 0;\n}",
        "stdin": "1",
        "expected_output": "1"
    });

    let client = reqwest::blocking::Client::new();
    let response = client.post(url)
        .json(&payload)
        .query(&[("base64_encoded", "false"), ("wait", "true"), ("fields", "stdout,status")])
        .send()?;

    if response.status().is_success() {
        let response_text = response.text()?;
        println!("{}", response_text);
    } else {
        eprintln!("Request failed with status code: {}", response.status());
    }
    Ok(())
}


fn main() {
    if let Err(e) = make_request() {
        eprintln!("Error: {:?}", e);
    }
}