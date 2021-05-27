const {addUser, getUser, removeUser, VideoCallUser, AnswerCall, AcceptedCall, getUserInRoom} = require('../Middleware/MessagingUser');
const moment = require('moment');

const Message = require('../Models/MessagingModel'); 
const User = require('../Models/UserModel');


const Messaging = (io) =>{
	io.on('connect', (socket) =>{
	    console.log('connected');
	    socket.on('join',({room, name}, cb) =>{
	    	const roomname = room;
	        const {error, user} = addUser({id: socket.id, name, roomname});
	        if(error) return cb(error);
	        socket.join(user.roomname);
	        cb();
	    })

		socket.on('sendMessage', async (msg, cb) =>{
			const curuser = getUser(socket.id);
			const {roomname, message, name, loginuser} = msg;
			if(!roomname) return
			
			const availableUser = getUserInRoom(roomname);
			// getting activate User from the socket room
			const loggedinUser = Object.values(availableUser).length;

			// getting db data of offline User
			const users = await User.findOne({$and :[{"friends.roomname": roomname}, {"isOnline" : false}]});

			if(users !== null){
				let count = users.friends[0].unreadMsg;

				// if user in socket count is 1 then updating unread message
				if(loggedinUser <= 1){
					await User.updateOne({
						$and :[{"friends.roomname": roomname}, {"isOnline" : false}]},{
							$set:{
							 "friends.$.unreadMsg": count + 1
							}
						});
				} 
				// setting last message at both User 
				await User.updateMany({"friends.roomname": roomname}, {
					$set:
					 {
					 	"friends.$.lastmsg": message
					 }
				});
				if(!curuser) return
		 	    const time = moment().format('M/D/YYYY H:mm').valueOf();
				const unixtime = moment(time, "M/D/YYYY H:mm").unix();
				io.to(curuser.roomname).emit('message', {user:loginuser, text:message, time:unixtime});
				await Message.findOneAndUpdate({roomname:roomname},{
					$push:{
						messages:{
							sender:name,
							receiver:loginuser,
							message:message,
							roomname: roomname,
							created: unixtime 
						}}
					})
				cb();
			}
		});

		// video call 
		socket.on('MakeVideoCall', async(msg) =>{
			let {roomname, loginuser} = msg;
			const curuser = VideoCallUser(roomname, loginuser);
			
			const availableUser = getUserInRoom(roomname);
			const loggedinUser = Object.values(availableUser).length;

			if(loggedinUser <= 1){
				roomname = roomname.trim();
				io.to(availableUser[0].id).emit('UserNotAvaiable');
				return
			}

			if(!curuser) return
			io.to(curuser[0].roomname).emit('NewVideoCall', {user:curuser[0].name, caller:loginuser, id:curuser[0].id});
		})

		socket.on('calluser', ({userToCall, signalData, from, name }) =>{
			io.to(userToCall).emit('calluser',{signal:signalData, from:from, name:name})
		})


		socket.on('answercall', (data) =>{
			const userToCall = data.to;
			const roomname = data.roomname;
			const user = AnswerCall(userToCall, roomname);
			console.log(user)
			io.to(user[0].roomname).emit('callaccepted',data.signal)
		})

		// call ended
		socket.on('callEnded', (data) =>{
			const userToCall = data.to;
			const roomname = data.roomname;
			const user = AnswerCall(userToCall, roomname);
			io.to(user[0].roomname).emit('callDisconnected')
		})

		//call ended by self
		socket.on('callEndedbySelf', (data) =>{
			const userToCall = data.to;
			const roomname = data.roomname;
			const user = AnswerCall(userToCall, roomname);
			io.to(user[0].roomname).emit('callDisconnectedself')
		})

		socket.on('disconnect', () =>{
			console.log('user gone');
			removeUser(socket.id);
		})
		socket.on('removeuser', () =>{
			console.log('gone');
			removeUser(socket.id);
		})
		socket.on('readyToAccept', (data)=>{
			const {roomname, loginuser} = data;
			const curuser = AcceptedCall(roomname, loginuser);
			if(!curuser) return
				console.log(curuser, 'readt to AcceptedCall');
			io.to(curuser[0].roomname).emit('readytoReceive')
		})
	
		socket.on('CallRejetced', (data)=>{
			const {roomname, loginuser} = data;
			const curuser = AcceptedCall(roomname, loginuser);
			if(!curuser) return
			io.to(curuser[0].id).emit('callRejected')
		})
	

	})
}


module.exports = Messaging;
