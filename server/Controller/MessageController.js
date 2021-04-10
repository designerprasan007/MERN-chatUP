const Message =  require('../Models/MessagingModel');


const getMessage = async (req, res) =>{
	const {roomname, start, end} = req.body;
	const data = await Message.findOne({roomname}, {messages:{$slice:[start,end]}}).sort({'created': -1});
	res.status(200).json({success:true, data});
}

const DeleteMessage = async (req, res) =>{
	const {roomname} = req.body;
	const data = await Message.findOneAndUpdate({"roomname": roomname}, {
		$unset:{
			messages:"messages"
		}
	});
	res.status(200).json({success:true, data});
}


module.exports = {getMessage,DeleteMessage};