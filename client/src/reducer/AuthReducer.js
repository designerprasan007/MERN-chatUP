export const AuthReducer =(state={}, action) => {
	switch(action.type){
		case 'AuthUser':
			return{userdata:action.payload};
		case 'REGISTER_ERROR':
			return{error:action.payload};
		case 'LOGIN_ERROR':
			return{loginerror: action.payload};
		case 'NEW_MESSAGE':
				state.userdata.user.friends.filter((fri) => fri.roomname === action.payload.roomname ? fri.lastmsg = action.payload.msg : '');
				return state
		default:
			return state
	}
}