import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

import{ Navbar, Nav, NavDropdown}  from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu} from "react-bootstrap-submenu";
import axios from "axios";
import GetBaseURL from "./GetBaseURL";

class NavBar extends Component {

    componentDidMount() {
        this.fetchInfo();
    }

    async fetchInfo() {
        let currentSeason = await this.currentSeason();
        let logistics = await this.LogisticsInfo();
        let previousSeasonList = logistics
            .filter(seasonInfo => seasonInfo.season != currentSeason)
            .map(seasonInfo => seasonInfo.season)

        this.setState({
            currentSeason: currentSeason,
            previousSeasons: previousSeasonList,
        });
    }

    async currentSeason() {
        return (await axios.get(GetBaseURL() + '/masters')).data[0].currentSeason
    }

    async LogisticsInfo() {
        return (await axios.get(GetBaseURL() + '/logistics')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            currentSeason: "0",
            previousSeasons: [],
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
                <Nav.Link href="/pickcontestants">Pick Contestants</Nav.Link>
                <NavDropdown alignRight title={Object.is(user.firstname, undefined) ? 'title' : user.firstname} id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={this.redirectChangePassword.bind(this)}>Change Password</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.onLogout.bind(this)}>Logout</NavDropdown.Item>
                    {(user.id === "5feb78416972daafed8c15c5") && (
                        <NavDropdown.Item onClick={this.redirectAdmin.bind(this)}>
                            Admin
                        </NavDropdown.Item>)}
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
                        <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
                        {previousSeasons}
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
