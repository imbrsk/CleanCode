import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/subject";

function Home(){

    return(
        <React.Fragment>
        <CssBaseline />
        <NavbarSign value="Sign Out" link="/"></NavbarSign>
        <Container maxWidth="lg">
            <Account user="Stefan19" tasks="70"></Account>
            <Subject name="Структурно Програмирање"></Subject>
            <Subject name="Напредно Програмирање"></Subject>
            <Subject name="Објектно-ориентирано Програмирање"></Subject>
            <Subject name="Алгоритми и податоци"></Subject>
        </Container>
        <Footer></Footer>
      </React.Fragment>
    );
}

export default Home;