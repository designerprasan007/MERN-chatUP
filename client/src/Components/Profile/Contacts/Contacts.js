
import staticImg from '../../../Assets/Images/staticpic.png';

import './Contacts.css';
const Contacts = ({getUser, userdata, handleAddShow}) =>{
	const friends = userdata?.user?.friends; 
	const userPic = friends[0]?.user?.userPic;

	return(
			<div className="contactList">
				<ul className="list-group">
					{friends?.length >= 1 ? (
						friends?.map((friend, key) =>{
							return(
								<li className="list-group-item" key={key}>
									<img src={userPic ? `https://demo.conitor.in:5000/${friend.user.userPic}` :  staticImg} alt="img" className="userpic" />
									<section  className="selectContact" onClick={getUser}>
										<span className="pl-2" 
										data-room={friend?.roomname} 
										data-pic={friend?.user?.userPic}
										data-num={friend?.friendnum}
										data-bio={friend?.user?.userbio}
										>{friend?.friendname}</span>
									</section>
								</li>
								)
					})):(
					<div className="addUserBtn text-center pr-2" >
						<button className="btn btn-success btn-sm" onClick={handleAddShow}>Add Friend+</button>
					</div>
					)}
				</ul>
			</div>
		)
}


export default Contacts