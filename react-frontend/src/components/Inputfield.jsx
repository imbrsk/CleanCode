import '../css/signin.css'

function Inputfield(props){
    
    let placeholder = props.placeholder;
    let type = props.type;

    return(<>
        <input type={type} id="fname" className='input-field' placeholder={placeholder}></input>
    </>);
}

export default Inputfield;