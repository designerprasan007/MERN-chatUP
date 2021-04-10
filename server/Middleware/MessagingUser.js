const users = [];


const addUser = ({id, roomname, name}) =>{
    name = name.trim().toLowerCase();
    roomname = roomname.trim().toLowerCase();
    const existing = users.find((user) => user.roomname === roomname && user.name === name);
    if(existing) return {error:'User Name Already Taken'};
    const user = {id, roomname, name};
    users.push(user);
    return {user}
}


const removeUser = (id) =>{
    const index = users.findIndex((user) =>  user.id === id );

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => users.find((user ) =>user.id === id);

const VideoCallUser = (roomname, loginuser) => {
    roomname = roomname.trim().toLowerCase();
    name = loginuser.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname && user.name !== name)
}

const AcceptedCall = (roomname, loginuser) => {
    roomname = roomname.trim().toLowerCase();
    name = loginuser.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname && user.name === name)
}

const AnswerCall = (userToCall, roomname) =>  {
    roomname = roomname.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname && user.id !== userToCall);
}

const getUserInRoom = (roomname) => {
    roomname = roomname.trim().toLowerCase();
    return users.filter((user) => user.roomname === roomname)
}


module.exports = { addUser, removeUser, getUser, getUserInRoom, VideoCallUser, AnswerCall, AcceptedCall}