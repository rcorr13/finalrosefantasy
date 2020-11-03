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
import PickContestants from "./components/PickContestants";
import CreateContestantComponent from "./components/create-contestant.component";
import ContestantsList from "./components/ContestantListTest";

//import {ContestantList} from "./contestants/ContestantList";
import { SingleContestantPage } from './contestants/SingleContestantPage';
import { EditContestantForm } from './contestants/EditContestantForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import UsersList from "./components/UsersTest";
import ContestantList from "./components/ContestantTest";

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
                            <Route exact path="/contestants" component={ ContestantsList } />
                            <Route exact path="/editContestant/:contestantId" component={ EditContestantForm } />
                            <Route exact path="/contestants/:contestantId" component={SingleContestantPage} />
                            <Route exact path="/create" component={CreateContestantComponent} />
                            <Route path="/listcontestants" component={ContestantsList} />
                            <Route path="/users" component={UsersList} />
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;