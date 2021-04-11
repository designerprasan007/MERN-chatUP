import {GetMessage} from '../api/'
export const GetMessageFunc = (roomname, start, end) => async(dispatch, getState) =>{
	try{
		const  {
			AuthReducer : {userdata}
		} = getState();
		const token = userdata.token; 
		const messages = await GetMessage(roomname, start, end, token);
		const msgs = messages?.data?.data?.messages;
		dispatch({type:'GET_ALL_MESSAGES', payload:msgs});
	}
	catch(e){
		console.log(e);
	}
}

export const LoadMoreMessge = (roomname, start, end) => async(dispatch, getState) =>{
	try{
		const  {
			AuthReducer : {userdata}
		} = getState();
		const token = userdata.token; 
		const messages = await GetMessage(roomname, start, end, token);
		const msgs = messages?.data?.data?.messages;
		if(msgs.length > 1){
			dispatch({type:'NEW_LOAD', payload:msgs});
			return
		}
		else{
			dispatch({type:'NO_MESSAGES', payload:'NO MORE MESSAGES'})
		}
	}
	catch(e){
		console.log(e);
	}
}

export const NewMessageState = (message, roomname) => async(dispatch) =>{
	let msg = message.text
	if(roomname !== ''){
		const data = {msg, roomname}
		dispatch({type:'NEW_MESSAGE', payload:data});
	}
}