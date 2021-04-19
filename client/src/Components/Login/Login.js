import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {LoginUserAction} from '../../actions/AuthAction';
import Chatimg from '../../Assets/Images/mychat.jpg';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


const Login = ({history}) =>{
	const [phonenum, setPhonenum] = useState('');
	const [requireError, setRequireError] = useState(false);
	const [password, setPassword] = useState('');
	const [loader, setLoader] = useState(false);

	const dispatch = useDispatch();

	const {userdata, loginerror} = useSelector((state) => state.AuthReducer);
	useEffect(() =>{
		if(userdata){
			history.push('/user');
		}
	},[userdata, history])


	const Loginuser = (e) =>{
		e.preventDefault();
		if(!phonenum || !password) {
			setRequireError(true);
			return
		}
		e.target.disabled = true;
		const phnum = '+' + phonenum;
		const formdata = {usernumber: phnum, password:password}
		dispatch(LoginUserAction(formdata)); 	
		setLoader(true);
	}
	return(
		<div className="container mt-3 text-center">
			<img src={Chatimg} className="chatimg img-fluid" alt="chat" />
			<div className="HeroClass">
				{loginerror && <p className="text-danger">Number Not registerd please click to Register
				<Link className="pl-3" to='/register'>register </Link>
				</p> }
				{requireError && <p className="text-danger">All fields Required</p>}
				{loader && !loginerror &&(
					<Loader type="ThreeDots" color="#007bff" height={50} width={50} timeout={10000} />
				)}
			    <label className="pt-3" htmlFor="exampleInputEmail1">Phone Number</label>
					<form className="pb-3 inputform">
					    <PhoneInput
					      className="myclass"
						  country={'in'}
						  value={phonenum}
						  onChange={(e) => setPhonenum(e)}
						/>
					  	<div className="form-group pt-3">
						    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" />
					    </div>
					    <div>
						    <button type="button" onClick={Loginuser} className="btn btn-primary">Login</button>
					    </div>
					    <div className="pt-2">
							<p><small>New User?</small></p>
							<Link to='/register'><button type="button" className="btn btn-sm btn-success">register</button></Link>
					    </div>
					</form>
			</div>
		</div>
		)
}


export default Login