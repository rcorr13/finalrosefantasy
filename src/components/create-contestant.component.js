import React, { Component } from 'react';
import axios from 'axios';

export default class CreateContestantComponent extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onChangeJob = this.onChangeJob.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangeStateUS = this.onChangeStateUS.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeImageLink = this.onChangeImageLink.bind(this);
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
        }
    }


    onChangeName(e) {
        this.setState({
            name: e.target.value,
            nameLink: (e.target.value).replace(/\s+/g, '-').toLowerCase()
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


    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(this.state);
        console.log(`nameLink: ${this.state.nameLink}`);
        console.log(`Name: ${this.state.name}`);
        //console.log(`Todo Responsible: ${this.state.todo_responsible}`);
        //console.log(`Todo Priority: ${this.state.todo_priority}`);

        const newContestant = {
            nameLink: this.state.nameLink,
            name: this.state.name,
            age: this.state.age,
            job: this.state.job,
            city: this.state.city,
            stateUS: this.state.stateUS,
            status: this.state.status,
            imageLink: this.state.imageLink,
            /*
            week1points: this.state.week1points,
            week1actions: this.state.week1actions,
            week2points: this.state.week2points,
            week2actions: this.state.week2actions,
            week3points: this.state.week3points,
            week3actions: this.state.week3actions
             */

        };

        axios.post('http://localhost:5000/addcontestants', newContestant)
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
        })

    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create New Todo</h3>
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
                        <input type="submit" value="Create Todo" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}