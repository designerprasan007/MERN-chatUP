import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Modal } from 'react-bootstrap'
import {GetMessageFunc} from '../../actions/MessageAction';
import {
	BrowserView,
	MobileView
  } from "react-device-detect";

import Header from '../Includes/Header';
import Userdata from './Userdata/Userdata';
import Contacts from './Contacts/Contacts';
import ChatSection from './ChatSection/ChatSection';
import Enterpass from '../Includes/Enterpass';
import AddUser from '../Includes/AddUser/AddUser'
import './Profile.css'
const Profile = ({history}) =>{
	const dispatch = useDispatch();

	const [presentUser, setPresentUser] = useState({name: '', room:'', profilePic:'', userbio:'', userNumber:'', chatName:''});
	const [showChat, setShowChat] = useState(false);
	const [showpassmodal, setShowPassModal] = useState(false);
	const [showaddusermodal, setShowAdduserModal] = useState(false);

	const {userdata} = useSelector((state) => state.AuthReducer);



	useEffect(() =>{
		if(userdata?.user?.password === "false"){
			setShowPassModal(true);
		}
		if(userdata === null){
			history.push('/')
		}
	}, [userdata, history])


	const handleClose = () => setShowPassModal(false);

	const handleAddClose = () => setShowAdduserModal(false);

	const handleAddShow = () => setShowAdduserModal(true);

	const getUser = (e) =>{
		const room = e.target.getAttribute('data-room');
		const profilePic = e.target.getAttribute('data-pic');
		const userbio = e.target.getAttribute('data-bio');
		const userNumber = e.target.getAttribute('data-num');
		const chatName = e.target.getAttribute('data-chatname');

		dispatch(GetMessageFunc(room, 0, 20));
		setPresentUser({...presentUser, room:room, name:e.target.innerHTML, profilePic:profilePic, userbio:userbio, userNumber:userNumber, chatName:chatName});
		setShowChat(true)
	}

	const hideChat = () =>{
		setShowChat(false)
	}
	return(
			<div>
				<Modal show={showpassmodal} onHide={handleClose} backdrop="static">
			        <Modal.Header closeButton>
			          <Modal.Title>Password</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			        	<Enterpass handleClose={handleClose} />
			        </Modal.Body>
		      	</Modal>
		 		{/* Modal for add Friend */}
		      	<Modal show={showaddusermodal} onHide={handleAddClose}>
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Body>
				<h3 className="bg-dark text-white py-2"> <span className="pl-2">Add Friend</span></h3>
					<AddUser handleAddClose={handleAddClose} userdata={userdata} />	
		        </Modal.Body>
			</Modal>
 				<Header />
				<BrowserView>
					<div className="row no-gutters respFont">
								<div className="col-md-3 col-12 border-right">
									<Userdata handleAddShow={handleAddShow} userdata={userdata} />
									<hr/>
									<Contacts  handleAddShow={handleAddShow} userdata={userdata}  getUser={getUser} />
								</div>
							{
								showChat ?(
									<div className="col-md-9">
										<ChatSection hideChat={hideChat} presentUser={presentUser} userdata={userdata}  />
									</div>
									): ('')
							}				
					</div>
				</BrowserView>
				<MobileView>
				<div className="row no-gutters respFont bg-dark">
					{
						!showChat ? (
							<div className="col-md-3 col-12 border-right">
								<Userdata handleAddShow={handleAddShow} userdata={userdata} />
								<hr/>
								<Contacts  handleAddShow={handleAddShow} userdata={userdata}  getUser={getUser} />
							</div>
						) : ('')
					}
					{
						showChat ?(
							<div className="col-md-9">
								<ChatSection hideChat={hideChat} presentUser={presentUser} userdata={userdata} />
							</div>
							): ('')
					}				
				</div>
				</MobileView>
			</div>
		)
}


export default Profile