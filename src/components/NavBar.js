import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import NavItem, { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

const Container = styled.div`
    display: flex;
    `;

class NavBar extends Component {

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    redirectAdmin(e) {
        e.preventDefault();
        this.props.history.push('/admin');
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
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
                        {(user.id === "5fa847fc43f5b23b2c605fa2") && (
                            <NavDropdown.Item onClick={this.redirectAdmin.bind(this)}>
                                Admin
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Container>
            </ul>
        )

        const guestLinks = (
            <ul className="navbar-nav mr-auto">
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
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <Link className="navbar-brand" to="/" style={{fontSize: 1.2 + 'em'}}>
                    <img src="/logo512.png" width="30" height="30" className="d-inline-block align-top"
                         alt="Rose" style={{marginRight: .7 + 'em'}}/>
                    Final Rose Fantasy</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav mr-auto">
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
                    <ul className="navbar-nav ml-auto">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {isAuthenticated ? authLinks : guestLinks}
                        </div>
                    </ul>
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
