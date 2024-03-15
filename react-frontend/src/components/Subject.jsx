import "../css/subject.css";
import { Outlet, Link } from "react-router-dom";

function Subject(props) {
  let name = props.name;
  return (
    <>
      <div className="subject">
        <div className="bracket">[</div>
        <Link to={props.link} className="subject-link">
          <div className="subject-text">{name}</div>
        </Link>
        <div className="bracket">]</div>
      </div>
    </>
  );
}

export default Subject;
