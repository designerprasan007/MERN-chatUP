import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'

import staticImg from '../../../Assets/Images/staticpic.png';

import './UserDetail.css';


const UserDetail = ({handleClose, presentUser}) =>{
    return(
    	<>
	    	<div className="userimg" style={{ backgroundImage: `url(${presentUser?.profilePic ? `http://localhost:5000/${presentUser.profilePic}` :  staticImg}`}}>
				<span className="closeUserdetail" onClick={handleClose}><FontAwesomeIcon icon={faArrowLeft} /></span>
			</div>
			<div className="UserDetail">	
				<p className="pl-3 userName pt-3">Name: <span className="pl-2">{presentUser.name}</span></p>
				<p className="pl-3 userName">Num: <span className="pl-3">{presentUser.userNumber}</span></p>
				<p className="pl-3 userName">Bio: <span className="pl-3">{presentUser.userbio}</span></p>
	    	</div>
    	</>
    )
}

export default UserDetail