const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types


const UserSchema = new mongoose.Schema({
	username : String,
	userbio : String,
	usernumber : String,
	randomName: String,
	password:{
		type:String,
		default: ''	
	},
	userPic:{
		type: String,
		default: 'staticpic.png'
	},
	friends:[{
			friendname: String,
			friendnum :String,
			roomname: String,
			user:{
				type: ObjectId,
				ref:'user'
			},
			accepted:{
				type:Boolean,
				default:true
			}
		}],
	created:{
		type: Date,
		required: true,
        default: Date.now
    }
});


UserSchema.methods.getSignedToken = function () {
	return jwt.sign({id: this._id}, process.env.JWT_TOKEN);
}


UserSchema.methods.Matchpass = async function(password){
	return await bcryptjs.compare(password, this.password);
}



const User = mongoose.model('user', UserSchema);

module.exports = User