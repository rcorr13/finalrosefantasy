import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Contestant = props => (
    <tr>
        <td>{props.contestant.name}</td>
        <td>{props.contestant.age}</td>
        <td>{props.contestant.job}</td>
        <td>
            <Link to={"/edit/"+props.contestant._id}>Edit</Link>
        </td>
    </tr>
)

export default class ContestantsList extends Component {

    constructor(props) {
        super(props);
        this.state = {contestants: []};
    }

    componentDidMount() {
        axios.get('http://localhost:5000/contestants')
            .then(response => {
                console.log(response.data);
                this.setState({ contestants: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }

    contestantList() {
        console.log(this.state);
        return this.state.contestants.map(function(currentContestant, i){
            return <Contestant contestant={currentContestant} key={i} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Contestants List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Job</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.contestantList() }
                    </tbody>
                </table>
            </div>
        )
    }
}
