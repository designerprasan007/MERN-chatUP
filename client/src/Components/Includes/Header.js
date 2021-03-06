import {Dropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {useDispatch} from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faCommentDots} from '@fortawesome/free-solid-svg-icons'
import {LogoutUserFun} from '../../actions/AuthAction'; 

import './Header.css';
const Header = ({history}) =>{
	const dispatch = useDispatch();
	const setPasstoLocal = () =>{
		localStorage.setItem('password', 'false')
	}
	const LogoutFun = () =>{
		dispatch(LogoutUserFun());
	}
	return(
			<div className="container-fluid bg-dark text-light py-2 headerClass">
				<div className="row">
					<div className="col">
						<Link to='/user'>
							<p className="text-light pl-3 BrandName"><FontAwesomeIcon icon={faCommentDots} /> Chat-up</p>
						</Link>
					</div>
					<div className="col">
						<div className="text-right">
						<Dropdown>
							<Dropdown.Toggle variant="dark" id="dropdown-basic">
							<FontAwesomeIcon icon={faBars} />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item as={Link} to='/userdetail' onClick={setPasstoLocal}>
								Edit Profile
								</Dropdown.Item>
								<Dropdown.Item onClick={() => LogoutFun()}>Logout</Dropdown.Item>
							</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
		)
}


export default Header;