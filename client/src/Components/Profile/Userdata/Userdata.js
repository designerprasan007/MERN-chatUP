import './Userdata.css';
const Userdata = ({userdata, handleAddShow}) =>{
	const user = userdata?.user;
	return(
		<div className="pt-3 text-center">
			<img src={`http://localhost:5000/${user?.userpic}`}  alt="chooseimg" className="img-fluid proImg rounded-circle" />
			<p className="uName pt-2">{user?.username}</p>
			<button className="btn btn-success btn-sm" onClick={handleAddShow}>Add Friend</button>
		</div>
		)
}


export default Userdata