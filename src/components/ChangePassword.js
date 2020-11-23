import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { changePassword } from '../actions/authentication';
//import {changePassword, registerUser, setCurrentUser} from '../actions/authentication';
import classnames from 'classnames';
import axios from "axios";

class ChangePassword extends Component {

    componentDidMount() {
        this.fetchUser();
    }

    async fetchUser() {
        let users = await this.allUsers();
        const {isAuthenticated, user} = this.props.auth;
        const userFull = (users.find(userID => userID._id===user.id));

        this.setState({
            user: userFull,
        });
    }

    async allUsers() {
        //return (await axios.get('http://localhost:5000/users')).data
        return (await axios.get('https://finalrosefantasy.herokuapp.com/users')).data
    }


    constructor() {
        super();
        this.state = {
            oldPassword: '',
            newPassword: '',
            newPassword_confirm: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let user = this.state.user;

        //this.setState({errors: {}})
        const updatedUser = {
            ...user,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            newPassword_confirm: this.state.newPassword_confirm
        };
        console.log(updatedUser)

        this.props.changePassword(updatedUser, this.props.history);
        /*
        //console.log(updatedUser)
        axios.put(('http://localhost:5000/updatepassword/'+user._id), {
            // axios.put(('https://finalrosefantasy.herokuapp.com/updateuser/'+user._id), {
            updatedUser
        })
         */

        //alert('Password Updated!')
        //this.props.history.push('/')
        //this.props.loginUser(user);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        const { errors } = this.state;
        console.log(errors);
        return(
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
                <h2 style={{marginBottom: '40px'}}>Change Password</h2>
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Old Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.oldPassword
                            })}
                            name="oldPassword"
                            onChange={ this.handleInputChange }
                            value={ this.state.oldPassword }
                        />
                        {errors.oldPassword && (<div className="invalid-feedback">{errors.oldPassword}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="New Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.newPassword
                            })}
                            name="newPassword"
                            onChange={ this.handleInputChange }
                            value={ this.state.newPassword }
                        />
                        {errors.newPassword && (<div className="invalid-feedback">{errors.newPassword}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.newPassword_confirm
                            })}
                            name="newPassword_confirm"
                            onChange={ this.handleInputChange }
                            value={ this.state.newPassword_confirm }
                        />
                        {errors.newPassword_confirm && (<div className="invalid-feedback">{errors.newPassword_confirm}</div>)}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

ChangePassword.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { changePassword })(ChangePassword)