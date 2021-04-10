import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


import {AddFriendAction} from '../../../actions/AuthAction';

const AddUser = ({userdata, handleAddClose}) =>{
	const [phonenum, setPhonenum] = useState('917892576008');
	const [name, setName] = useState('');
	const [error, setError] = useState({status:false, text:'', noname:false});
	const [preFriendname, setpreFriendname] = useState('')
	
	const dispatch = useDispatch();

	const usernum = userdata?.user?.usernumber; 

	const friends = userdata?.user?.friends;

	const {nouser} = useSelector((state) => state.AddFriend);


	useEffect(() =>{
		let intervalId;
		if(nouser){
 			 clearState()
			 intervalId = setTimeout(() => { 
			 	clearInterval()
			}, 5000)
		}
		return () => clearTimeout(intervalId); // eslint-disable-next-line
	}, [nouser])

	function clearInterval() {
		setTimeout(() =>setError({...error, status:false, text:"", noname:false}), 5000);
	}

	function clearState() {
		setError({...error, status:true, text:"No Number Found", noname:false});
	}

	const addUserFun = (e) =>{
		e.preventDefault();
		const num = '+' + phonenum;

		if(usernum !== num){
			const preFriend = friends.find((friend) => friend.friendnum === num);
			if(preFriend){
				setError({...error, status:true, text:"This Number already saved as", noname:false});
				setpreFriendname(preFriend.friendname);
				clearInterval()
				
			}
			else{
				if(name === ''){
					setError({...error, status:true, text:"Name is required",noname:true});
					clearInterval()
					return true
				}
				const frienddata = {friendname: name, friendnum: num}
				dispatch(AddFriendAction(frienddata));
			}
			
		}else{
			setError({...error, status:true, text:"You cant use own Number",noname:true});
			clearInterval()
			return true
		}
	}
	return (
	<div className="">
	{error.status && <p className="text-danger">{error.text} {!error.noname && <span className="text-dark">
	 {preFriendname}  
	</span>}</p>}
		<label htmlFor="inputName">Name</label>
		<input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Enter Name" /> 
		<label className="pt-2" htmlFor="exampleInputEmail1">Phone Number</label>
		<form className="pb-3 inputform">
			<PhoneInput
				className="myclass"
				country={'in'}
				value={phonenum}
				onChange={(e) => setPhonenum(e)}
			/>
			<div className="text-center pt-3">
				<button type="button" className="btn btn-success" onClick={(e) => addUserFun(e)}>Add</button>	
			</div>
		</form>
	</div>
		)
}


export default AddUser;