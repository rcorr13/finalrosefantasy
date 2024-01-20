import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

import{ Navbar, Nav, NavDropdown}  from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import axios from "axios";
import GetBaseURL from "./GetBaseURL";

class NavBar extends Component {

    componentDidMount() {
        this.fetchInfo();
    }

    async fetchInfo() {
        let logistics = await this.LogisticsInfo();

        let previousSeasonList = logistics
            .filter(seasonInfo => seasonInfo.status != "On")
            .map(seasonInfo => seasonInfo.season)

        let currentSeasonList = logistics
            .filter(seasonInfo => seasonInfo.status == "On")
            .map(seasonInfo => seasonInfo.season)

        let currentSeason = await this.currentSeason(currentSeasonList);

        let currentLogistics = logistics.filter(option => option.season === currentSeason)[0];
        let currentWeek = currentLogistics.currentWeek;
    
        this.setState({
            currentSeason: currentSeason,
            currentWeek: currentWeek,
            previousSeasons: previousSeasonList,
            currentSeasons: currentSeasonList,
        });
    }

    async currentSeason(currentSeasonList) {
        if (length(currentSeasonList) < 1.5) {
            return (await axios.get(GetBaseURL() + '/masters')).data[0].currentSeason
        }
        let currentSeason = window.sessionStorage.getItem("currentSeason")
        if (currentSeason) {
            return currentSeason
        }
        return (await axios.get(GetBaseURL() + '/masters')).data[0].currentSeason
    }
    
    async LogisticsInfo() {
        return (await axios.get(GetBaseURL() + '/logistics')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            currentSeason: "Bachelor-28",
            currentWeek: "1",
            previousSeasons: [],
            currentSeasons: [],
        };
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    redirectAdmin(e) {
        e.preventDefault();
        this.props.history.push('/admin');
    }

    redirectChangePassword(e) {
        e.preventDefault();
        this.props.history.push('/changepassword');
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;

        const authLinks = (
            <Nav className="ml-auto">
                <Nav.Link href={"/pickcontestants/" + this.state.currentSeason}>Pick Contestants</Nav.Link>
                <NavDropdown alignRight title={Object.is(user.firstname, undefined) ? 'title' : user.firstname} id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={this.redirectChangePassword.bind(this)}>Change Password</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.onLogout.bind(this)}>Logout</NavDropdown.Item>
                    {(user.id === "5feb78416972daafed8c15c5") && (
                        <div>
                            <NavDropdown.Item onClick={this.redirectAdmin.bind(this)}>Admin</NavDropdown.Item>
                            <NavDropdown.Item href={"/picks/" + this.state.currentSeason + "/" + this.state.currentWeek}>Picks</NavDropdown.Item>
                        </div>
                    )}
                </NavDropdown>
            </Nav>
        )

        const guestLinks = (
            <Nav className="ml-auto">
                <Nav.Link href="/register">Sign Up</Nav.Link>
                <Nav.Link href="/login">Sign In</Nav.Link>
            </Nav>
        )

        const previousSeasons = (
            <NavDropdownMenu title="Previous Seasons" id="previous-seasons" >
                {this.state.previousSeasons.map(season =>
                <DropdownSubmenu title={season.replace(/-/gi, ' S')} key={season}>
                    <NavDropdown.Item href={"/contestantslist/" + season}>Contestants</NavDropdown.Item>
                    <NavDropdown.Item href={"/standings/" + season}>Standings</NavDropdown.Item>
                    <NavDropdown.Item href={"/graphs/" + season}>Graphs</NavDropdown.Item>
                    <NavDropdown.Item href={"/scoringrules/" + season}>Rules</NavDropdown.Item>
                </DropdownSubmenu>
                )}
            </NavDropdownMenu>
        )

        const currentSeasons = (
            <Form inline>
                <Form.Group controlId="formSelectSeason">
                    <Form.Control
                    as="select"
                    value={this.state.currentSeason}
                    onChange={e => {
                        window.sessionStorage.setItem("currentSeason", e.target.value);
                        this.setState({currentSeason: e.target.value});
                        console.log("currentSeason: ", e.target.value);
                        let currentPath = window.location.pathname;
                        let currentPathSplit = currentPath.split("/");
                        if (currentPathSplit.length == 3) {
                            let newPath = "/" + currentPathSplit[1] + "/" + e.target.value;
                            window.location.href = newPath;
                        }
                    }}
                    >
                    {this.state.currentSeasons.map(season =>
                        <option key={season} value={season}>{season.replace(/-/gi, ' S')}</option>
                    )}
                    </Form.Control>
                </Form.Group>
            </Form>
        )

        return(
            <Navbar collapseOnSelect className="sticky-nav" sticky="top" expand="md" bg="dark" variant="dark" style={{zIndex: '10'}}>
                <Navbar.Brand href="/">
                    <Navbar.Brand>
                        <img src="/logo512.png" width="30" height="30" className="d-inline-block align-top"
                             alt="Rose" style={{marginRight: .5 + 'em'}}/>
                        Final Rose Fantasy
                    </Navbar.Brand>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href={"/contestantslist/" + this.state.currentSeason}>Contestants</Nav.Link>
                        <Nav.Link href={"/standings/" + this.state.currentSeason}>Standings</Nav.Link>
                        <Nav.Link href={"/graphs/" + this.state.currentSeason}>Graphs</Nav.Link>
                        <Nav.Link href={"/scoringrules/" + this.state.currentSeason}>Scoring Rules</Nav.Link>
                        <Nav.Link href="/howto">How To</Nav.Link>
                        <Nav.Link href="/leaderboard">All-Time Leaderboard</Nav.Link>
                        {previousSeasons}
                        {currentSeasons}
                    </Nav>
                    {isAuthenticated ? authLinks : guestLinks}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(NavBar));
