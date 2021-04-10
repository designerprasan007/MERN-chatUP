
import {useRef, useEffect, useState} from 'react';
import Peer from 'simple-peer';

import './VideoCall.css'

const VideoCall = ({socket, roomname, loginuser, remoteCall}) =>{
	const connectionRef = useRef();
    const myVideo = useRef();
    const userVideo = useRef();

	const [stream, setStream] =useState(null);
    const [idtocall, setIdtoCall] = useState('');
	const [call, setCall] = useState({})
	const [callAccpted, setCallAccepted] = useState(false);
	const [readytoReceive, setReadyToReceive] = useState(false)

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
			console.log('user accepted call');
			setReadyToReceive(true);

		})
	},[socket])

	/* when all the user hit thec all button updates the Class state
	 and set the signal and default values to the call state */

	useEffect(() =>{
		socket.on('calluser', ({from, name: callerName, signal}) =>{
			console.log('called user')
			setCall({isReceivingCall: true,  from:from, name:callerName, signal:signal});
		})
		socket.on('callDisconnected', (userToCall) =>{
			console.log('call ended');
			window.location.reload();
		})
	},[socket])


	/* aftet rendering videocall page, it allow first to watch the self camera
	   after hitting the Call user button it sends notification to remote User */

	 const callUser = (id) =>{
	 	console.log('calling user')
		const peer  = new Peer({initiator: true, trickle: false, stream})

		peer.on('signal', (data) =>{
			socket.emit('calluser', {userToCall: id, signalData: data, from:loginuser, name:'callerName' })

		})

		peer.on('stream', (currentStream) =>{
			userVideo.current.srcObject = currentStream;	
		})
		
		socket.on('callaccepted', (signal) =>{
			setCallAccepted(true)
			console.log('call accepted');
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





	return(
		<>
			{!remoteCall && readytoReceive && (
				<button className="rounded-circle btn btn-sm btn-primary callNowBtn" onClick={() => callUser(idtocall)}>Call now</button>
				)}
			{call.isReceivingCall && !callAccpted && (
				<button className="rounded-circle btn btn-sm btn-success callNowBtn" onClick={AnswerCall} >Accept Call</button>
				)}
			{callAccpted && (
				<button className="rounded-circle btn btn-sm btn-danger callNowBtn" onClick={leaveCall} >End Call</button>
				)}
			<video className="myvideo" playsInline muted ref={myVideo} autoPlay />
			<video className="friendVideo" playsInline muted ref={userVideo} autoPlay />
		</>
		)
}


export default VideoCall