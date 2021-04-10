const User = require('../Models/UserModel');
const Message = require('../Models/MessagingModel'); 
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fs = require('fs');

const addNewUser = async (req, res) =>{
	const {usernumber} = req.body;

	let preUser = await User.findOne({usernumber});

	if(preUser) return res.status(401).json({success:false, message:'User already Registered'});

	try{
		const user = await User.create({usernumber});
		sendToken(user, 200, res);
	}
	catch(e){
		console.log(e);
		res.status(500).json({success:false, message:e.message});
	}
}


const LoginUser = async(req, res) =>{
	const { usernumber, password } = req.body;
	try{
		const checkuser = await User.findOne({usernumber}).populate('friends.user','userPic userbio');
		if(!checkuser) return res.status(401).json({success:false, message:'Unauthorized'});

		const isMatch =  await bcryptjs.compare(password, checkuser.password); 
		
		if(!isMatch) return res.status(403).json({success: false, message:'Invalid Password'});

		sendToken(checkuser, 200, res);	
	}
	catch(e){
		console.log(e);
		res.status(500).json({success:false, message:e.message});
	}
}


const updateUser = async(req, res) =>{
	const {name, bio} = req.body;
	const userid = req.user._id;

	let r = Math.random().toString(36).substring(7);
	const randomName = name + r;
	let preUser = await User.findOne({_id: userid});
	try{

		if(!req.file){
			const update =	await User.findByIdAndUpdate(userid,
			 { 
			 	username: name.toLowerCase(),
			 	userbio: bio,
			 	userPic: preUser.userPic ? preUser.userPic : 'staticpic.png',
			 	randomName: preUser.randomName ? preUser.randomName : randomName,
			 },
		 	 {
				new:true
			})
			sendToken(update, 200, res)	
		}else{
			fs.exists(`./ProfilePic/${preUser.userPic}`, function(exists) {
			  if(exists) {
				fs.unlinkSync(`./ProfilePic/${preUser.userPic}`);
			  }
			});
			const update =	await User.findByIdAndUpdate(userid,
			 { 
			 	username: name.toLowerCase(),
			 	userbio: bio,
			 	userPic: req.file.filename,
			 	randomName: preUser.randomName ? preUser.randomName : randomName,
			 },
		 	 {
				new:true
			}).populate('friends.user','userPic userbio')
			sendToken(update, 200, res)
			}
		}
		catch(e){
			console.log(e);
			res.status(500).json({success:false, message:e.message});
		}
	}


const addFriend = async(req, res) =>{

	//user1 always stand for the logged in user and user2 stands for the second user(friend) 
	
	const {friendname, friendnum} = req.body;
	const userid =  req.user._id;
	const user1 = req.user.username;
	const user2 = friendname.toLowerCase();
	const user1num = req.user.usernumber;
	function rand(length, current) {
	  current = current ? current : '';
	  return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz?<>".charAt(Math.floor(Math.random() * 60)) + current) : current;
	}

	const roomname = rand(20);

	try{
		let preUser = await User.findOne({usernumber:friendnum});
		if(!preUser) return res.status(404).json({success:false, message: "User not found"});
		const id = preUser._id;
		
		// adding user in the friendlist of second user 
		await User.findOneAndUpdate({usernumber:friendnum},{
			$push:{
				friends:{
					friendname:user1,
					friendnum:user1num,
					roomname: roomname,
					user: userid
				}}
			})

		// adding friend to the self friendlist
		let update = await User.findByIdAndUpdate(userid,{
			$push:{
				friends:{
					friendname:friendname,
					friendnum:friendnum,
					roomname: roomname,
					user: id
				}
			}
		},{
			new:true
		}).populate('friends.user','userPic userbio');

		const addmemeber = await Message.create({user1, user2, roomname})
		sendToken(update, 200, res)

	}
	catch(e){
		console.log(e);
		res.status(500).json({success:false, message:e.message});
	}
}

const updatePassword = async(req, res) =>{

	const {password} = req.body;
	const userid =  req.user._id;

	const salt = await bcryptjs.genSalt(10);
	const p1 = await bcryptjs.hash(password, salt)

	try{
		const update =	await User.findByIdAndUpdate(userid,
			 { password : p1 },
		 	 {new:true})
		sendToken(update, 200, res)

	}catch(e){
		console.log(e);
		res.status(500).json({success:false, message:e.message});

	}
}

// block friend
// const blockFriend = async (req, res) =>{
// 	try{

// 		const {roomname} = req.body;
// 		const userid =  req.user._id;
	
// 		const preUser = await User.findOne({'friends.roomname': roomname}); 

// 		if(!preUser) return res.status(403).json({success:false, message: 'Unauthorized'});

// 		const update =	await User.findByIdAndUpdate(userid,
// 			{
// 			$set:{
// 				friends:{
// 					accepted: false,
// 					friendname:preUser.friends.friendname,
// 					friendnum:preUser.friends.friendnum,
// 					roomname: preUser.friends.roomname,
// 					user: preUser.friends.user
// 				}
// 			}
// 		}).populate('friends.user','userPic userbio')

// 		console.log(update);

// 		res.send('okay');
// 	}catch(e){
// 		console.log(e)
// 	}
// }

const sendToken = (user, status, res) => {
	const token = user.getSignedToken();
	const password = user.password ? 'true' : 'false';
	const resUser = {
		_id: user._id,
		username: user.username,
		userbio: user.userbio,
		usernumber: user.usernumber,
		randomName : user.randomName,
		userpic: user.userPic,
		password: password,
		friends : user.friends,
	};
	res.status(status).json({success:true, user:resUser, token: token});
}



module.exports = {addNewUser, addFriend, updateUser, updatePassword, LoginUser};