import React from 'react'
import ReactDOM from 'react-dom/client'
import RocketPostRequest from './App.jsx'
import MyComponent from './get.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyComponent>
    </MyComponent>
    <RocketPostRequest />
    <RocketPostRequest />
  </React.StrictMode>,
)
