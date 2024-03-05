import '../css/account.css'
import Cookies from "js-cookie";


function Account(props){

    let user = props.user;
    let tasks = props.tasks;
    const session = {"session": Cookies.get("session")};

    const getAccount = async () => {
        try {
            const response = await fetch('http://localhost:8000/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonResponse = await response.json();
            user = jsonResponse['username'];
            tasks = jsonResponse['solved'];
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }
    }
    getAccount();
    return(<>
    <div className="account">
        <div className="account-info">Account</div>
        <div className='account-user'>User: <div className='account-userstyle'>{user}</div></div>
        <div className='account-tasks'>Activity: <div className='account-tasksstyle'>{tasks} tasks solved</div></div>

    </div>
    </>);
}

export default Account;