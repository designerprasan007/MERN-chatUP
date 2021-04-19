
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {RegisterUserAction} from '../../actions/AuthAction';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


import Chatimg from '../../Assets/Images/mychat.jpg';

import './Register.css';
const Register = ({history}) =>{

	const [phonenum, setPhonenum] = useState('');
	const dispatch = useDispatch();
	
	const [loader, setLoader] = useState(false);
	const [requireError, setRequireError] = useState(false);


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

	const registeruser = (e) =>{
		e.preventDefault();
		if(!phonenum) {
			setRequireError(true);
			return
		}
		e.target.disabled = true;
		const phnum = '+' + phonenum;
		dispatch(RegisterUserAction(phnum)); 	
		setLoader(true);

	}

	return(
		<div className="container mt-3 text-center">
			<img src={Chatimg} className="chatimg img-fluid" alt="chat" />
			<div className="HeroClass">
				{error && <p className="text-danger">Phone Number Already Taken
				<Link className="pl-3" to='/'>Login </Link>
				</p> }
				{requireError && <p className="text-danger">Please Enter Phone Num</p>}
				{loader && !error &&(
					<Loader type="ThreeDots" color="#007bff" height={50} width={50} timeout={10000} />
				)}    
			    <label htmlFor="exampleInputEmail1">Phone Number</label>
				<form className="pb-3 inputform">
				    <PhoneInput className="myclass" country={'in'} value={phonenum} onChange={(e) => setPhonenum(e)} />
					<div className="pt-2">
					    <button type="button" onClick={registeruser} className="btn btn-sm btn-primary">Register</button>
				    </div>
				    <div className="pt-2">
						<p><small>Already Have Account?</small></p>
						<Link to='/'><button type="button" className="btn btn-sm btn-success">Login</button></Link>
				    </div>
				</form>
			</div>
		</div>
		)
}


export default Register