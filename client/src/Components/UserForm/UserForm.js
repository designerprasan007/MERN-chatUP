
import { Modal, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../Includes/Header';
import {AddUserDataAction} from '../../actions/AuthAction';

import staticImg from '../../Assets/Images/staticpic.png';

import './UserForm.css';

const UserForm = ({history}) =>{
	const dispatch = useDispatch();
	const [userformdata, setFormData] = useState({username: '', userbio:''});
	const [show, setShow] = useState(false);
    const [{alt, src, imgdata}, setImg] = useState({
  	      	src: staticImg,
    	    alt: 'Upload an Image',
       	});

	const {userdata} = useSelector((state) => state.AuthReducer);
    useEffect(() =>{
    	if(!userdata){
    		history.push('/')
    	}
    	if(userdata){
    		setFormData({...userformdata, userbio:userdata.user?.userbio, username:userdata?.user?.username})
			if(userdata?.user?.userpic){
				setImg({
          	  		src: `https://demo.conitor.in:5000/${userdata?.user?.userpic}`,
        		});	
			}	
    	}
		// eslint-disable-next-line
    },[history, userdata])

	
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleChange = (e) => {
    if(e.target.files[0]) {
        setImg({
            src: URL.createObjectURL(e.target.files[0]),
            alt: e.target.files[0].name,
            imgdata: e.target.files[0]
        });  
        }   
    }
    const clickImage = () =>{
    	document.getElementById('selectimg').click();
    }

    const sendData = (e) =>{
    	e.preventDefault();
    	let formdata = new FormData();
    	formdata.append('name', userformdata.username);
    	formdata.append('bio', userformdata.userbio);
    	formdata.append('profilepic', imgdata);
    	dispatch(AddUserDataAction(formdata));
		history.push('/user');
    }


	return(
		<div className="container-fluid">	
			<Header />
			<div className="text-center  pt-3">
				<h3>Edit Profile</h3>
				<div className="pt-3">
					<div className="inputbutton" onClick={handleShow}>
					  <span  className="text">.</span>
					  <img src={src} alt={alt} className="edit_pic rounded-circle"/>
					</div>
				</div>
				<Modal show={show} onHide={handleClose}>
			        <Modal.Header closeButton>
			          <Modal.Title>Change Profile Picture</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			        <div className="text-center">
			        <label className="filebutton">
			        	<input type="file" onChange={handleChange} style={{display:'none'}} id="selectimg"  />
			        	</label>
		                <img src={src} alt={alt} onClick={clickImage}  className="img-preview rounded-circle"/>
			        </div>
			        </Modal.Body>
			        <Modal.Footer>
			          <Button variant="primary" onClick={handleClose}>
			            Upload
			          </Button>
			        </Modal.Footer>
		      	</Modal>	
		      	<section className="container pt-5 text-center">
			      	<form className="col-md-6 offset-md-3">
					  <div className="form-group">
					    <input type="text" value={userformdata.username || ''} onChange={(e) => setFormData({...userformdata, username:e.target.value})} className="form-control" placeholder="Enter your Name" />
					    <small id="emailHelp" className="form-text text-muted text-left">This name will be shown to Group</small>
					  </div>
					  <div className="form-group">
					    <input type="text" className="form-control" value={userformdata.userbio || ''} onChange={(e) => setFormData({...userformdata, userbio:e.target.value})} placeholder="Write about you"/>
					  </div>
					  {userformdata?.username?.length >= 3 ? 
					  	(<button type="button" onClick={sendData}  className="btn btn-primary">Submit</button>)
					  	:('')
						}
					</form>
		      	</section>
			</div>
		</div>
		)
}


export default UserForm