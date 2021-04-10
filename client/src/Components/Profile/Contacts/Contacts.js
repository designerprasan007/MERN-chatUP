
import staticImg from '../../../Assets/Images/staticpic.png';

import './Contacts.css';
const Contacts = ({getUser, userdata, handleAddShow}) =>{
	const friends = userdata?.user?.friends; 
	const userPic = friends[0]?.user?.userPic;

	console.log(friends);

	return(
			<div className="contactList">
				<ul className="list-group">
					{friends?.length >= 1 ? (
						friends?.map((friend, key) =>{
							return(
								<li className="list-group-item" key={key}>
								<div className="row no-gutters">
									<div className="col-md-2 col-2">
										<img src={userPic ? `https://demo.conitor.in:5000/${friend.user.userPic}` :  staticImg} alt="img" className="userpic" />
									</div>
									<div className="col-md-10 col-10">
										<section  className="selectContact" onClick={getUser}>
											<span className="pl-2 h5" 
											data-room={friend?.roomname} 
											data-pic={friend?.user?.userPic}
											data-num={friend?.friendnum}
											data-bio={friend?.user?.userbio}>
											{friend?.friendname}</span>
											<p className="pl-3 pt-2 lstMsg">{friend?.lastmsg}</p>
									</section>
									</div>
								</div>
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