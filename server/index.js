require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const database = require('./config/database');
const Messaging = require('./Utils/Messaging');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

const messagerouter = require('./Routes/messagerouter');
const userRouter = require('./Routes/UserRoutes'); 
const morgan = require('morgan');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());

app.use(express.static(path.join(__dirname, 'ProfilePic')));

app.use('/api/messages', messagerouter);
app.use('/auth/users', userRouter);

const server = http.createServer(app);


const io = socketio(server);

Messaging(io);





server.listen(PORT, () =>{
    database();
    console.log(`serving on ${PORT}`);

})