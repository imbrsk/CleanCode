import '../css/subject.css'
import { Outlet, Link } from "react-router-dom";

function Subject(props) {
  let name = props.name;
  return (
    <>
    <Link to={props.link} className='subject-link'>
      <div className="subject">
        <div className="bracket">[</div>
        <div className="subject-text">{name}</div>
        <div className="bracket">]</div>
      </div>
    </Link>
    </>
  );
}

export default Subject;
