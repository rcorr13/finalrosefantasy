import React, { Component } from 'react';
import axios from 'axios';
import GetBaseURL from "./GetBaseURL";

export default class CreateContestant extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onChangeJob = this.onChangeJob.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangeStateUS = this.onChangeStateUS.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeImageLink = this.onChangeImageLink.bind(this);
        this.onChangeSeason = this.onChangeSeason.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            nameLink: '',
            name: '',
            age: '',
            job: '',
            city: '',
            stateUS: '',
            status: '',
            imageLink: '',
            season: '',
            totalpoints: "0"
        }
    }


    onChangeName(e) {
        this.setState({
            name: e.target.value,
            nameLink: (e.target.value).replace(/\s+/g, '-'),
        });
    }

    onChangeJob(e) {
        this.setState({
            job: e.target.value
        });
    }

    onChangeAge(e) {
        this.setState({
            age: e.target.value
        });
    }

    onChangeCity(e) {
        this.setState({
            city: e.target.value
        });
    }

    onChangeStateUS(e) {
        this.setState({
            stateUS: e.target.value
        });
    }

    onChangeStatus(e) {
        this.setState({
            status: e.target.value
        });
    }


    onChangeImageLink(e) {
        this.setState({
            imageLink: e.target.value
        });
    }

    onChangeSeason(e) {
        this.setState({
            season: e.target.value
        });
    }


    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(this.state);
        console.log(`nameLink: ${this.state.nameLink}`);
        console.log(`Name: ${this.state.name}`);

        const newContestant = {
            nameLink: [this.state.nameLink,this.state.season].join("-"),
            name: this.state.name,
            age: this.state.age,
            job: this.state.job,
            city: this.state.city,
            stateUS: this.state.stateUS,
            status: this.state.status,
            imageLink: this.state.imageLink,
            season: this.state.season,
            totalpoints: this.state.totalpoints,
        };

        axios.post(GetBaseURL() + '/addcontestant', newContestant)
            .then(res => console.log(res.data));

        this.setState({
            nameLink: '',
            name: '',
            age: '',
            job: '',
            city: '',
            stateUS: '',
            status: '',
            imageLink: '',
            season: '',
        })

    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create New Contestant</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label>Job: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.job}
                            onChange={this.onChangeJob}
                        />
                    </div>
                    <div className="form-group">
                        <label>Age: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.age}
                            onChange={this.onChangeAge}
                        />
                    </div>
                    <div className="form-group">
                        <label>City: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.city}
                            onChange={this.onChangeCity}
                        />
                    </div>
                    <div className="form-group">
                        <label>State: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.stateUS}
                            onChange={this.onChangeStateUS}
                        />
                    </div>
                    <div className="form-group">
                        <label>Season: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.season}
                            onChange={this.onChangeSeason}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input"
                                    type="radio"
                                    name="priorityOptions"
                                    id="on"
                                    value="on"
                                    checked={this.state.status==='on'}
                                    onChange={this.onChangeStatus}
                            />
                            <label className="form-check-label">On</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input"
                                    type="radio"
                                    name="priorityOptions"
                                    id="eliminated"
                                    value="eliminated"
                                    checked={this.state.status==='eliminated'}
                                    onChange={this.onChangeStatus}
                            />
                            <label className="form-check-label">Eliminated</label>
                        </div>
                        <div className="form-group">
                            <label>Image Link: </label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.imageLink}
                                onChange={this.onChangeImageLink}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="submit" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
