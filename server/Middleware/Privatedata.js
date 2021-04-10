const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');


exports.getPrivateData = async(req, res, next) =>{
	let token;
	if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
		token = req.headers.authorization.split(" ")[1];
	}

	if(!token) return res.status(403).json({success: false, message:"Not Authorized"});

	try{
		const decoded = jwt.verify(token, process.env.JWT_TOKEN);
		const user = await User.findById(decoded.id);


		if(!user) return res.status(403).json({success: false, message:"Not Authorized"});

		req.user = user;
		next();
	}
	catch(e) {
		return res.status(500).json({success:false, message:e.message});
	}
}