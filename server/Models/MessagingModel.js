const mongoose = require('mongoose');



const MessagingSchema =  new mongoose.Schema({
		user1:String,
		user2:String,
		roomname:String,
		messages:[{
			sender:String,
			receiver:String,
			message:String,
			msgread:{
				type:Boolean,
				default:false
			},
			created:String
		}],
})



const Message = mongoose.model('message', MessagingSchema);

module.exports = Message