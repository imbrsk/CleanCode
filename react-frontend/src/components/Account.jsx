import '../css/account.css'

function Account(props){

    let user = props.user;
    let tasks = props.tasks;
    user = "Stefan19";
    tasks = "70";
    return(<>
    <div className="account">
        <div className="account-info">Account</div>
        <div className='account-user'>User: <div className='account-userstyle'>{user}</div></div>
        <div className='account-tasks'>Activity: <div className='account-tasksstyle'>{tasks} tasks solved</div></div>

    </div>
    </>);
}

export default Account;