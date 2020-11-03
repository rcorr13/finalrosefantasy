import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getContestants from '../contestants/getContestants'


export default class ContestantInfoTest extends Component {
    state = {contestants: []};

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

    componentDidMount;

    contestantsAndColumns = {
        contestants: this.state.contestants,
        columns: {
            'column-1': {
                id: 'column-1',
                title: 'All Contestants',
                contestantIds: [0,1,2,3,4,6]
            },
            'column-2': {
                id: 'column-2',
                title: 'My Picks',
                contestantIds: [],
            },
        },

        columnOrder: ['column-1', 'column-2'],
    };
}
