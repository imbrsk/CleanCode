import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Sign from "./pages/Sign";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Landingpage></Landingpage>} path="/"/>
          <Route path="sign-in" element={<Sign></Sign>} />
          <Route path="register" element={<Register></Register>} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);