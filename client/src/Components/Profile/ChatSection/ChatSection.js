import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Modal } from 'react-bootstrap'

	
import {NewMessageState} from '../../../actions/MessageAction';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';

import staticImg from '../../../Assets/Images/staticpic.png';

import ChatBox from '../../Includes/ChatBox/ChatBox';

import UserDetail from '../../Includes/UserDetail/UserDetail';

import msgtone from "../../../Assets/Tones/msgtone.mp3";

import ChatHeader from '../../Includes/ChatHeader';
import VideoCall from '../../Includes/VideoCall/VideoCall';

import './ChatSection.css';
let socket;

const ChatSection = ({presentUser, hideChat, userdata}) =>{
	const dispatch = useDispatch();
    const audio_tag = useRef(null);
    


	const [roomname, setRoomname] = useState('');
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [showpassmodal, setShowPassModal] = useState(false);
	
	// video call related
	const [videoSection, setVideoSection] = useState(false)
	const [call, setCall] = useState({})
	const [remoteCall, setRemoteCall] = useState(false);

	
	const loginuser = userdata?.user?.username 
	const friends = userdata?.user?.friends; 
	const userPic = friends[0].user.userPic;
	const preMessages = useSelector(state => state.MessageReducer);
	const {error} = useSelector(state => state.MessageReducer);
	const ENDPOINT = 'https://demo.conitor.in:5000'; 
	const {name, room} = presentUser;


	useEffect(() =>{
		const messageArea = document.getElementById('chatSection');
		messageArea.scrollTop = messageArea.scrollHeight;
		setRoomname(room);
        socket = io(ENDPOINT, {transports: ['websocket']});
        if(socket && room ) socket.emit('join', {name, room}, () =>{});
       
        return () =>{
            socket.emit('disconnec');
            socket.off();
        } // eslint-disable-next-line
    }, [])



	useEffect(() =>{
		socket.on('NewVideoCall', (callData) =>{
			setCall({isReceivingCall: true});
		})
	},[])


	useEffect(() =>{
		socket.on('message', (message) =>{
            setMessages([...messages, message]);
            dispatch(NewMessageState(message, roomname));
            const messageArea = document.getElementById('chatSection');
			messageArea.scrollTop = messageArea.scrollHeight;
			if(message.user !== loginuser){
            	const audioEl = document.getElementsByClassName("msgtone")[0]
				audioEl.play()	
            }
        }, [messages])
	})


	const sendMessage = (e) =>{
        e.preventDefault();
        if(message){
        	const messagedata = {message, roomname, name, loginuser };
            socket.emit('sendMessage',messagedata, () => setMessage(''));
        }
    }

	const removeSocket = (e) =>{
		e.preventDefault();
		socket.emit('removeuser');
		socket.off();
		hideChat();
	}

	
	const handleClose = () => setShowPassModal(false);
	const showUserdetail = () => setShowPassModal(true);


	const videocall = () =>{
		setVideoSection(true);
	}

	const AnswerCall = () =>{
		setVideoSection(true);
		setRemoteCall(true);
		socket.emit('readyToAccept', {roomname:roomname, loginuser})
	}


	return(
		<>	
			{!videoSection ? (
				<>
					<audio className="msgtone" ref={audio_tag} src={msgtone} />
					<Modal show={showpassmodal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
					        <Modal.Body>
					        	<UserDetail presentUser={presentUser} handleClose={handleClose} />
					        </Modal.Body>
				      	</Modal>
					<div className="bg-dark py-3">
						<ChatHeader videocall={videocall} showUserdetail={showUserdetail} userPic={userPic} staticImg={staticImg} removeSocket={removeSocket} presentUser={presentUser} />
					</div>
					{call.isReceivingCall && (
							<div>
								<h1>{presentUser.name} is calling</h1>
								<button onClick={AnswerCall}>Answer</button>
							</div>		
						)}
					<div className="chatSection" id="chatSection">
						<ChatBox message={preMessages} msgover = {error} friends={friends}  loginuser={loginuser} presentUser={presentUser} socketmessage={messages} />
					</div>
					<div className="messageForm">
						<input value={message} onChange={(event) => setMessage(event.target.value)} onKeyPress={event => event.key === 'Enter' ? sendMessage(event):'null' } className="MsgInput" />
						<button className="btn btn-sm btn-primary" onClick={(e) => sendMessage(e)}>
							<FontAwesomeIcon icon={faPaperPlane} />
						</button>
					</div>
				</>
				):(
					<VideoCall socket={socket} roomname={room} loginuser={loginuser} remoteCall={remoteCall} />
				)}
		</>
		)
}


export default ChatSection