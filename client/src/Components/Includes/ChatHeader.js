import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faVideo, faPhone} from '@fortawesome/free-solid-svg-icons'

const ChatHeader = ({showUserdetail, videocall, userPic, staticImg, removeSocket, presentUser}) =>{
	
	return(
			<div className="row no-gutters">
				<div className="col-3 pl-3">
					<span className="exitClass pt-3 pr-2" onClick={(e)=> removeSocket(e)}><FontAwesomeIcon icon={faArrowLeft} /></span>	
					<img src={userPic ? `http://localhost:5000/${presentUser.profilePic}` :  staticImg} alt="img" className="userpic" />
				</div>
				<div className="col-6 text-white pl-2" onClick={() => showUserdetail()}> 
					<h4 className="mt-2" >{presentUser.name}</h4>
				</div>
				<div className="col-3 pt-2 text-white headerIcons">
					<h5 onClick={videocall}><FontAwesomeIcon icon={faVideo} /></h5>
					<h5 className="pl-4"><FontAwesomeIcon icon={faPhone} /></h5>
				</div>

			</div>
		)
}

export default ChatHeader;