import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import UserForm from './Components/UserForm/UserForm';




const App = () =>{
	return(
			<Router>
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/register" exact component={Register} />
					<Route path="/user" exact component={Profile} />
					<Route path="/userdetail" exact component={UserForm} />

				</Switch>
			</Router>
		)
}


export default App;