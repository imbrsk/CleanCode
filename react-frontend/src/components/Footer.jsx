import "../css/footer.css";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";

function Footer() {
  return (
    <>
      <div className="footer-container">
          <div className="footer-copyright">
            ©Stefan Saveski ©Boris Gjorgievski
          </div>
          <div className="footer-tabs">
            <div className="footer-help">Help</div>
            <Link className="footer-about"  to={"/about"}> About</Link>
            <div className="footer-terms">Terms</div>
            <div className="footer-privacy">Privacy Policy</div>
          </div>
      </div>
    </>
  );
}

export default Footer;
