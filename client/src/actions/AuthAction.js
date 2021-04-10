import {RegisterUser, addUserdataApi, updatePassApi, LoginApi, AddfriendApi} from '../api';


export const RegisterUserAction = (usernumber) =>  async(dispatch) =>{
	try{
		const {data} = await RegisterUser(usernumber);
		dispatch({type:'AuthUser', payload:data});
		localStorage.setItem('Userinfo', JSON.stringify(data))
	}
	catch(e){
		dispatch({type:'REGISTER_ERROR', payload:e.message});
	}
}

export const AddUserDataAction = (formdata) => async(dispatch, getState) =>{
	try{
		const  {
		AuthReducer : {userdata}
	} = getState();
	const token = userdata.token; 
	const {data} = await addUserdataApi(formdata, token);
	localStorage.setItem('Userinfo', JSON.stringify(data))
	dispatch({type:'AuthUser', payload:data});
	console.log(data);
	
	}
	catch(e){}
}

export const setPassFun = (password) => async(dispatch, getState) =>{
	try{
		const  {
		AuthReducer : {userdata}
		} = getState();
		const token = userdata.token; 

		const {data} = await updatePassApi(password, token);
		localStorage.setItem('Userinfo', JSON.stringify(data))
		dispatch({type:'AuthUser', payload:data});
	}
	catch(e){
		console.log(e);
	}
}

export const LoginUserAction = (formdata) => async(dispatch) =>{
	try{
		const {data} = await LoginApi(formdata);
		dispatch({type:'AuthUser', payload:data});
		localStorage.setItem('Userinfo', JSON.stringify(data))
	}catch(e){
		console.log(e)
		dispatch({type:'LOGIN_ERROR', payload:e.message});
	}
}


export const AddFriendAction = (friend) => async(dispatch, getState) =>{
	try{
		const  {
		AuthReducer : {userdata}
		} = getState();
		const token = userdata.token; 
		const {data} = await AddfriendApi(friend, token);
		localStorage.setItem('Userinfo', JSON.stringify(data))
		dispatch({type:'AuthUser', payload:data})
	}
	catch(e) {
		dispatch({type:"FRIEND_NO_EXIST", payload:e.message});
	}
}

// export const BlockFriendAction = (room) =>async(dispatch, getState) =>{
// 	try{
// 		console.log(room);
// 		const {
// 			AuthReducer: {userdata}
// 		} = getState();
// 		const token = userdata.token;
// 		const {block} = BlockUserApi(room, token);
// 		console.log(block)
// 	}
// 	catch(e){
// 		console.log(e);
// 	}
// }