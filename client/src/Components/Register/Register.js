
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {RegisterUserAction} from '../../actions/AuthAction';


import Chatimg from '../../Assets/Images/mychat.jpg';

import './Register.css';
const Register = ({history}) =>{

	const [phonenum, setPhonenum] = useState('917090631200');
	const dispatch = useDispatch();

	const {userdata, error} = useSelector((state) => state.AuthReducer);
	
	useEffect(() =>{
		if(localStorage.getItem('UserInfo')){
			history.push('/userdetail');
		}
		if(userdata){
			setPhonenum('');
			history.push('/userdetail');
		}		
	},[userdata, history])

	if(error){
		console.log(error)
	}



	const registeruser = (e) =>{
		e.preventDefault();
		const phnum = '+' + phonenum;
		dispatch(RegisterUserAction(phnum)); 	
	}

	return(
			<div className="container mt-3 text-center">
				<img src={Chatimg} className="chatimg img-fluid" alt="chat" />
				<div className="HeroClass">
				{error && <p className="text-danger">Phone Number Already Taken
				<Link className="pl-3" to='/'>Login </Link>
				</p> }
				    <label htmlFor="exampleInputEmail1">Phone Number</label>
						<form className="pb-3 inputform">
						    <PhoneInput
						      className="myclass"
							  country={'in'}
							  value={phonenum}
							  onChange={(e) => setPhonenum(e)}
							/>
						</form>
					{
					phonenum.length >= 10 ?(
 					    <button type="button" onClick={registeruser} className="btn btn-primary">Register</button>
					): ('')
					}
				</div>
			</div>
		)
}


export default Register