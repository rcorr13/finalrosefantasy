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
import CurrentPicks from "./components/CurrentPicks";

import 'bootstrap/dist/css/bootstrap.min.css';
import ChangePassword from "./components/ChangePassword";
import HowTo from "./components/HowTo";
import ScoringRules from "./components/ScoringRules";
import DeleteContestant from "./components/DeleteContestant";
import CreateContestant from "./components/CreateContestant";
import {spacing} from "@material-ui/system";
import SeasonGraphs from "./components/SeasonGraphs";
import Leaderboard from "./components/Leaderboard";

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
                            <div className="links">
                                <Route exact path="/register" component={ Register } />
                                <Route exact path="/login" component={ Login } />
                                <Route exact path="/pickcontestants" component={ PickContestants } />
                                <Route exact path="/scoreform" component={ContestantScoreForm} />
                                <Route exact path="/admin" component={AdminPage} />
                                <Route exact path="/changepassword" component={ChangePassword} />
                                <Route exact path="/howto" component={HowTo} />
                                <Route exact path="/leaderboard" component={Leaderboard} />
                                <Route exact path="/createcontestant" component={CreateContestant} />
                                <Route exact path="/deletecontestant" component={DeleteContestant} />
                                <Route path="/scoringrules/:season" component={ ScoringRules } />
                                <Route path="/contestantslist/:season" component={ ContestantsList } />
                                <Route path="/standings/:season" component={Standings} />
                                <Route path="/graphs/:season" component={SeasonGraphs} />
                                <Route path="/picks/:season/:week" component={CurrentPicks} />
                            </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
