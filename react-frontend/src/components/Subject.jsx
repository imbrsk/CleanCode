import '../css/subject.css'

function Subject(props) {
  let name = props.name;
  return (
    <>
      <div className="subject">
        <div className="bracket">[</div>
        <div className="subject-text">{name}</div>
        <div className="bracket">]</div>
      </div>
    </>
  );
}

export default Subject;
