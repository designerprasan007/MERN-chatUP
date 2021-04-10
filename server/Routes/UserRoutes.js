const express = require('express');

const user = express.Router();
const multer  = require('multer');


const {getPrivateData} = require('../Middleware/Privatedata');
const {addNewUser, addFriend, updateUser, updatePassword, LoginUser} = require('../Controller/UserController');


const path = require('path');

const Storage = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, './ProfilePic')
	},
	filename:(req, file, cb) =>{
		cb (null, Date.now() + path.extname(file.originalname));
	}
})

const fileFilter = (req, file, cb) =>{
	if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
		cb(null, true);
	}else{
		cb(null, false);
	}
}

const upload = multer({storage: Storage, fileFilter : fileFilter});


// create new user
user.post('/newuser', addNewUser);
// Store User Data (name and bio)
user.post('/detail', getPrivateData, upload.single('profilepic'), updateUser);
// store User password
user.post('/setpassword', getPrivateData, updatePassword)

// login
user.post('/login', LoginUser)

user.post('/addfriend', getPrivateData, addFriend);


// block User

// user.post('/blockFriend', getPrivateData, blockFriend)


module.exports = user;