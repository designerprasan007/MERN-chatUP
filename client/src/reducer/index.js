import {combineReducers} from 'redux';

import {AuthReducer} from './AuthReducer';
import {AddFriend} from './AddFriend';
import {MessageReducer} from './MessageReducer'

export default combineReducers({AuthReducer, AddFriend, MessageReducer}); 