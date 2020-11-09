import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import { NavDropdown } from "react-bootstrap";

const Container = styled.div`
    display: flex;
    `;

class NavBar extends Component {

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
        //console.log(user)
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <Container>
                <li className="nav-item">
                    <Link className="nav-link" to="/pickcontestants">Pick Contestants</Link>
                </li>
                </Container>
                <Container>
                    <NavDropdown title={user.firstname} id="basic-nav-dropdown">
                        <NavDropdown.Item>
                            Account Information
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={this.onLogout.bind(this)}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Container>
            </ul>
        )
        const guestLinks = (
                <ul className="navbar-nav ml-auto">
                    <Container>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Sign Up</Link>
                    </li>
                    </Container>
                    <Container>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Sign In</Link>
                    </li>
                    </Container>
                </ul>
        )
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <ul className="navbar-nav ml-auto">
                    <Container>
                        <li className="nav-item">
                        <Link className="navbar-brand" to="/" style={{fontSize: 1.2 + 'em'}}>
                            <img src="/logo512.png" width="30" height="30" className="d-inline-block align-top"
                                alt="Rose" style={{marginRight: .7 + 'em'}}/>
                        Final Rose Fantasy</Link>
                        </li>
                    </Container>
                    <Container>
                        <li className="nav-item">
                            <Link className="nav-link" to="/standings">Standings</Link>
                        </li>
                    </Container>
                    <Container>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contestantslist">Contestants</Link>
                        </li>
                    </Container>
                </ul>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
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
