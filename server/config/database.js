const mongoose = require('mongoose');


const database = async() => {
    try {
        mongoose.connect(process.env.MONGOOSE_DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
		console.log("mongo connected");
    } catch (error) {
        console.log(error);
    }
}


module.exports = database;