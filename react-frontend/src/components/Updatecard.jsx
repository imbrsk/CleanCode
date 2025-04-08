import "../css/updates.css";

function Updatecard(props) {
  const color = props.color;
  const title = props.title;
  const text1 = props.text1;
  const text2 = props.text2;
  const text3 = props.text3;

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
