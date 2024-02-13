import '../css/signin.css'

function Inputfield(props){
    const { placeholder, type, value, onChange } = props;

    return (
        <input 
            type={type} 
            id="fname" 
            className='input-field' 
            placeholder={placeholder} 
            value={value} // Controlled value
            onChange={onChange} // Controlled onChange event
        />
    );
}

export default Inputfield;
