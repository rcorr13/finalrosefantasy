import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';

import NavBar from './components/NavBar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import PickContestants from "./components/ContestantPicker";
import ContestantScoreForm from "./components/ContestantScoreForm";
import AdminPage from "./components/AdminPage";
import ContestantsList from "./components/ContestantsList";
import Standings from "./components/Standings";

import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePassword from "./components/ChangePassword";
import HowTo from "./components/HowTo";

if(localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));

    const currentTime = Date.now() / 1000;
    if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login'
    }
}

class App extends Component {

    render() {
        return (
            <Provider store = { store }>
                <Router>
                    <div>
                        <NavBar />
                        <Route exact path="/" component={ Home } />
                        <div className="container">
                            <Route exact path="/register" component={ Register } />
                            <Route exact path="/login" component={ Login } />
                            <Route exact path="/pickcontestants" component={ PickContestants } />
                            <Route exact path="/contestantslist" component={ ContestantsList } />
                            <Route exact path="/standings" component={Standings} />
                            <Route exact path="/scoreform" component={ContestantScoreForm} />
                            <Route exact path="/admin" component={AdminPage} />
                            <Route exact path="/changepassword" component={ChangePassword} />
                            <Route exact path="/howto" component={HowTo} />
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;