export const MessageReducer = (state={}, action) =>{
	switch(action.type){
		case 'GET_ALL_MESSAGES':
			return {messages: action.payload};
		case 'NEW_LOAD' :
			return{...state, messages:state.messages.concat(action.payload)};
		case 'NO_MESSAGES':
			return{...state, error:action.payload}	
		default:
			return state
	}
}