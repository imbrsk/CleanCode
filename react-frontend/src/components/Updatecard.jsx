import "../css/updates.css";

function Updatecard(props) {
  let color = props.color;
  let title = props.title;
  let text1 = props.text1;
  let text2 = props.text2;
  let text3 = props.text3;

  return (
    <>
      <div className="updatecard-container">
        <div className="updatecard-title" style={{color: color} }>{title}</div>
        <div className="updatecard-vertline"></div>
        <div className="updatecard-text">{text1}<br/>{text2}<br/>{text3}</div>
      </div>
    </>
  );
}

export default Updatecard;
