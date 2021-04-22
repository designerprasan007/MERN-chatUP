
import {useRef, useEffect, useState} from 'react';
import Peer from 'simple-peer';

import Busy_tone from '../../../Assets/Tones/busy_tone.mp3'
import './VideoCall.css'

const VideoCall = ({socket, roomname, loginuser, remoteCall}) =>{
	const connectionRef = useRef();
    const myVideo = useRef();
    const userVideo = useRef();
    const busy_tone = useRef(null);

	const [stream, setStream] =useState(null);
    const [idtocall, setIdtoCall] = useState('');
	const [call, setCall] = useState({})
	const [callAccpted, setCallAccepted] = useState(false);
	const [readytoReceive, setReadyToReceive] = useState(false);

	useEffect(() =>{
		navigator.mediaDevices.getUserMedia({video: true, audio:true})
			.then((currentStream) =>{
				setStream(currentStream);
				myVideo.current.srcObject = currentStream
			});

			const messagedata = {roomname, loginuser };
	        socket.emit('MakeVideoCall',messagedata);
		},[roomname, loginuser, socket])


	// get the id of the remote user and sets that to state
	useEffect(() =>{
		socket.on('NewVideoCall', (callData) =>{
			const id = callData.id;
			setIdtoCall(id);
		})
		socket.on('readytoReceive',() =>{
		setReadyToReceive(true);

		})
		socket.on('UserNotAvaiable', () =>{
			const audioEl = document.getElementsByClassName("busytoneClass")[0]
			if(audioEl !== undefined){
				audioEl.play()	
			}
		})
		// socket event on call rejected by the opposite user
		socket.on('callRejected', () =>{
			const audioEl = document.getElementsByClassName("busytoneClass")[0]
			if(audioEl !== undefined){
				audioEl.play()	
			}
		})
	},[socket])

	/* when all the user hit thec all button updates the Class state
	 and set the signal and default values to the call state */

	useEffect(() =>{
		socket.on('calluser', ({from, name: callerName, signal}) =>{
			setCall({isReceivingCall: true,  from:from, name:callerName, signal:signal});
		})
		socket.on('callDisconnected', (userToCall) =>{
			window.location.reload();
		})
	},[socket])


	/* aftet rendering videocall page, it allow first to watch the self camera
	   after hitting the Call user button it sends notification to remote User */

	 const callUser = (id) =>{
		const peer  = new Peer({initiator: true, trickle: false, stream})

		peer.on('signal', (data) =>{
			socket.emit('calluser', {userToCall: id, signalData: data, from:loginuser, name:'callerName' })

		})

		peer.on('stream', (currentStream) =>{
			userVideo.current.srcObject = currentStream;	
		})
		
		socket.on('callaccepted', (signal) =>{
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer;

	}
	/* after passing call event from the Call User function answer call button will be shown in the
		remote computer to join the meeting */
	const AnswerCall = () =>{
		const peer  = new Peer({initiator: false, trickle: false, stream})
		// passes the current User id and filters in the server side to get opposite user id
		peer.on('signal', (data) =>{
			socket.emit('answercall', {signal:data, to:idtocall, roomname:roomname })
		})
		peer.on('stream', (currentStream) =>{
			userVideo.current.srcObject = currentStream;	
		})
		peer.signal(call.signal)
		connectionRef.current = peer;
		setCallAccepted(true)
	}
	const leaveCall = () =>{
		connectionRef.current.destroy();
		socket.emit('callEnded', {id:idtocall, roomname:roomname})
	}
	const endMycall = () =>{
		socket.emit('callEndedbySelf', {id:idtocall, roomname:roomname})
		window.location.reload();
		
	}
	return(
		<>
			<audio className="busytoneClass" ref={busy_tone} src={Busy_tone} />
			{!remoteCall && readytoReceive && (
				<button className="rounded-circle btn btn-sm btn-primary callNowBtn" onClick={() => callUser(idtocall)}>Call now</button>
				)}
			{call.isReceivingCall && !callAccpted && (
				<button className="rounded-circle btn btn-sm btn-success callNowBtn" onClick={AnswerCall} >Accept Call</button>
				)}
			{callAccpted && (
				<button className="rounded-circle btn btn-sm btn-danger callNowBtn" onClick={leaveCall} >End Call</button>
				)}
			<button className="rounded-circle btn btn-sm btn-danger callNowBtn" onClick={endMycall} >End Call</button>
			<video className="myvideo" playsInline muted ref={myVideo} autoPlay />
			<video className="friendVideo" playsInline muted ref={userVideo} autoPlay />
		</>
		)
}


export default VideoCall