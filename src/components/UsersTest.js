import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const User = props => (
    <tr>
        <td>{props.user.name}</td>
        <td>{props.user.contestants}</td>
        <td>{props.user._id}</td>
        <td>
            <Link to={"/edit/"+props.user._id}>Edit</Link>
        </td>
    </tr>
)

export default class UsersList extends Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users')
            .then(response => {
                console.log(response.data);
                this.setState({ users: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }

    userList() {
        console.log(this.state);
        return this.state.users.map(function(currentUser, i){
            return <User user={currentUser} key={i} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Users List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contestants</th>
                        <th>ID</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.userList() }
                    </tbody>
                </table>
            </div>
        )
    }
}
