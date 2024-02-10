import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Sign from "./pages/Sign";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Landingpage></Landingpage>} path="/"/>
          <Route path="sign-in" element={<Sign></Sign>} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);