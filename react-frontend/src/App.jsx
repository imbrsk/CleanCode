import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Navbar from './Navbar';
import Hero from './Hero';

function App(){

    return(
    <>
    <React.Fragment>
      <CssBaseline />
      <Navbar></Navbar>
      <Container maxWidth='lg'>
        <Hero></Hero>
      </Container>
    </React.Fragment>
    </>);
}

export default App;