FROM rust:latest
WORKDIR /
COPY Cargo.toml .
COPY . .
RUN cargo build --release

CMD ["./target/release/rockettest"]
