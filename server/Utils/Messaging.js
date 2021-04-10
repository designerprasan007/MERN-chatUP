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

			// const availableUser = getUserInRoom(roomname);

			// console.log(loginuser, 'loginuser');


			// const loggedinUser = Object.values(availableUser).length;
			// if(loggedinUser <= 1){
			// 	console.log(availableUser, 'one user');
			// } 
			// else{
			// 	console.log(availableUser, 'two users');
			// }
			const data = await User.updateMany({"friends.roomname": roomname}, {
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
		});

		// video call 
		socket.on('MakeVideoCall', async(msg) =>{
			const {roomname, loginuser} = msg;
			console.log(roomname, loginuser);	
			const curuser = VideoCallUser(roomname, loginuser);
			if(!curuser) return
			io.to(curuser[0].roomname).emit('NewVideoCall', {user:curuser[0].name, caller:loginuser, id:curuser[0].id});
		})

		socket.on('calluser', ({userToCall, signalData, from, name }) =>{
			console.log(userToCall, 'asa');
			io.to(userToCall).emit('calluser',{signal:signalData, from:from, name:name})
		})


		socket.on('answercall', (data) =>{
			const userToCall = data.to;
			const roomname = data.roomname;
			const user = AnswerCall(userToCall, roomname);
			io.to(user[0].id).emit('callaccepted',data.signal)
		})

		// call ended
		socket.on('callEnded', (data) =>{
			const userToCall = data.to;
			const roomname = data.roomname;
			const user = AnswerCall(userToCall, roomname);
			io.to(user[0].roomname).emit('callDisconnected',data.userToCall)
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
			console.log(roomname, loginuser);	
			const curuser = AcceptedCall(roomname, loginuser);
			io.to(curuser[0].id).emit('readytoReceive')
			console.log(curuser)
		})
	
	})
}


module.exports = Messaging;
