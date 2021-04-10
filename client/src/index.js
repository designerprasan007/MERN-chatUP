import React from 'react';
import ReactDom from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';

import {composeWithDevTools} from 'redux-devtools-extension';

import App from './App';

import reducers from './reducer';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'


const UserinfoStorage = localStorage.getItem('Userinfo') ? JSON.parse(localStorage.getItem('Userinfo')) : null


const InitialState = {
	AuthReducer  : {userdata: UserinfoStorage}
}

const middlware = [thunk];



const Store = createStore(reducers, InitialState,  composeWithDevTools(applyMiddleware(...middlware)));





ReactDom.render(
		<Provider store={Store} >
			<App />
		</Provider>
		, 
		document.querySelector('#root')
		)




