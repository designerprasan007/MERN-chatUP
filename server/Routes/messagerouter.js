const express = require('express');

const messagerouter = express.Router();

const {getPrivateData} = require('../Middleware/Privatedata');

const {getMessage,DeleteMessage} = require('../Controller/MessageController');


messagerouter.post('/', getPrivateData, getMessage);

messagerouter.post('/deletemsg', getPrivateData, DeleteMessage)

module.exports = messagerouter;