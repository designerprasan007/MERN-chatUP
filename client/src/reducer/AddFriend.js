export const AddFriend = (state={}, action) =>{
	switch(action.type){
		case 'FRIEND_NO_EXIST':
			return{nouser: action.payload};
		default:
			return state
	}
}