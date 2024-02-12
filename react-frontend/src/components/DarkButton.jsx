import '../css/updates.css'
import '../css/btn.css'
import { Outlet, Link } from "react-router-dom";


function DarkButton(props){

    let value = props.value;
    let link = props.link;
    return(<>
        <Link to={link} className="reg-btn">{value}</Link>
    </>);
}

export default DarkButton;