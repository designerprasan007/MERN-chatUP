import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {LoginUserAction} from '../../actions/AuthAction';
import Chatimg from '../../Assets/Images/mychat.jpg';


const Login = ({history}) =>{
	const [phonenum, setPhonenum] = useState('917090631200');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();

	const {userdata, loginerror} = useSelector((state) => state.AuthReducer);
	useEffect(() =>{
		if(userdata){
			history.push('/user');
		}
	},[userdata, history])


	const Loginuser = (e) =>{
		e.preventDefault();
		const phnum = '+' + phonenum;
		const formdata = {usernumber: phnum, password:password}
		dispatch(LoginUserAction(formdata)); 	
	}
	return(
		<div className="container mt-3 text-center">
			<img src={Chatimg} className="chatimg img-fluid" alt="chat" />
			<div className="HeroClass">
			{loginerror && <p className="text-danger">Number Not registerd please click to Register
			<Link className="pl-3" to='/register'>register </Link>
			</p> }

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
					</form>
				{
				phonenum.length >= 10 ?(
					    <button type="button" onClick={Loginuser} className="btn btn-primary">Login</button>
				): ('')
				}
			</div>
		</div>
		)
}


export default Login