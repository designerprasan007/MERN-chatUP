import { useState } from 'react';
import {useDispatch} from 'react-redux';
import {setPassFun} from '../../actions/AuthAction';
const Enterpass = ({handleClose}) =>{
	const dispatch = useDispatch();
	const [userformdata, setFormData] = useState({password: '', conf_password:''});
	const {password} = userformdata; 

	const sendData = (e) =>{
    	e.preventDefault();
    	if(password !== userformdata.conf_password){
    		alert('not match')
    		return true
    	}
    	if(!password && !userformdata.conf_password){
    		alert('All field required')
    		return true
    	}else{
    		dispatch(setPassFun(password));
    		handleClose();	
    	}
    }

	return(
		<section className="text-center">
	      	<form className="col-md-12 col-12">
			  <div className="form-group">
			    <input type="password" value={password || ''} onChange={(e) => setFormData({...userformdata, password:e.target.value})} className="form-control" placeholder="Password" />
			  </div>
			  <div className="form-group">
			    <input type="password" required className="form-control" value={userformdata.conf_password || ''} onChange={(e) => setFormData({...userformdata, conf_password:e.target.value})} placeholder="Confirm Password"/>
			  </div>
			  <button type="button" onClick={sendData} disabled={!password} required className="btn btn-primary">Submit</button>
			</form>
      	</section>
		)
}


export default Enterpass;