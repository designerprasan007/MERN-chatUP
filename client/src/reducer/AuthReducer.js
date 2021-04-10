export const AuthReducer =(state={}, action) => {
	switch(action.type){
		case 'AuthUser':
			return{userdata:action.payload};
		case 'REGISTER_ERROR':
			return{error:action.payload};
		case 'LOGIN_ERROR':
			return{loginerror: action.payload};
		case 'NEW_FRIEND':
			return{...state, ...state.friends, friends:action.payload};
		default:
			return state
	}
}