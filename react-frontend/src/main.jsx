import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Sign from "./pages/Sign";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Problems from "./pages/Problems";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Landingpage></Landingpage>} path="/"/>
          <Route path="sign-in" element={<Sign></Sign>} />
          <Route path="register" element={<Register></Register>} />
          <Route path="forgot-password" element={<ForgotPassword></ForgotPassword>} />
          <Route path="home" element={<Home></Home>} />
          <Route path="problems" element={<Problems></Problems>} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);