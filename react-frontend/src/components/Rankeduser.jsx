import "../css/rankeduser.css";

function Rankeduser(props) {
  let name = props.name;
  let tasks = props.tasks;
  return (
    <>
      <div className="lb-container">
        <div className="lb-user">{name}</div>
        <div className="lb-tasks">{tasks}</div>
      </div>
    </>
  );
}

export default Rankeduser;
