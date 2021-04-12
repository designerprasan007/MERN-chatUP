import axios from 'axios';


const AuthURL= 'https://demo.conitor.in:5000/';
const MessageURl = 'https://demo.conitor.in:5000/api/messages';

export const RegisterUser = (usernumber) => axios.post(`${AuthURL}auth/users/newuser`, {usernumber})

export const addUserdataApi = (formdata, token) => axios.post(`${AuthURL}auth/users/detail`, formdata, 
		{
			headers:{
					
					Authorization: 'Bearer ' + token 
				}}

	);
export const updatePassApi = (password, token) => axios.post(`${AuthURL}auth/users/setpassword`, {password},{
		headers:{
					
					Authorization: 'Bearer ' + token 
				}	
})


export const LoginApi = (formdata) => axios.post(`${AuthURL}auth/users/login`, formdata);

export const LogoutApi = (token) => axios.post(`${AuthURL}auth/users/logout`, {}, {
	headers:{
		Authorization: 'Bearer ' + token
	}
})

export const AddfriendApi = (friend, token) => axios.post(`${AuthURL}auth/users/addfriend`, friend, {
	headers:{
		Authorization: 'Bearer ' + token
	}
})


// getting previous messages

export const GetMessage = (roomname, start, end, token) => axios.post(`${MessageURl}/`, {roomname, start, end}, {
	headers:{
		Authorization: 'Bearer ' + token
	}
});


// block User

// export const BlockUserApi = (roomname, token) => axios.post(`${AuthURL}auth/users/blockFriend`, {roomname},{
// 	headers:{
// 		Authorization: 'Bearer ' + token
// 	}
// }) 