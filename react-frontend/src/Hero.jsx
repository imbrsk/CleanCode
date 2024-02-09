import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, ThemeProvider } from '@mui/system';
import Container from '@mui/material/Container';
import './hero.css';
import study from './assets/study.svg'
import practice from './assets/practice.svg'
import solve from './assets/solve.svg'

function Hero(){
    return(<>
    <div className='hero-container'>
        <div className='hero-study'>
            Study
            <img src={study} alt="" />
        </div>
        <div className='hero-practice'>
            Practice
            <img src={practice} alt="" />    
        </div>
        <div className='hero-solve'>
            Solve
            <img src={solve} alt="" />    
        </div>
        
    </div>
    </>);
}

export default Hero;