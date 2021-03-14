import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';
import axios from "axios";
import GetBaseURL from "./GetBaseURL";

export default class SeasonGraphs extends Component {
    componentDidMount() {
        this.fetchContestants();
        //const { datasets } = this.refs.chart.chartInstance.data
        //console.log(datasets[0].data);
    }
   
    async LogisticsInfo() {
        return (await axios.get(GetBaseURL() + '/logistics')).data
    }

    async fetchContestants() {
        let master = await this.MasterInfo();
        const usingSeason = this.props.match.params.season;
        let currentWeek = master[0].currentWeek;
        let currentSeason = master[0].currentSeason;
        if (currentSeason != usingSeason) {
            let logistics = await this.LogisticsInfo();
            let currentLogistics = logistics.filter(option => option.season === this.props.match.params.season)[0];
            currentWeek = currentLogistics.lastWeek;        
        }

        let users = await this.allUsers();

        let weekUserPointTotals = {};
        let userRankings = {};

        users.map(user => {
            userRankings[user.firstname] = []
        });

        for (let i = 1; i <= currentWeek; i++) {
            let weekName = ('week' + i + 'total');
            weekUserPointTotals[weekName] = {};
        }
        ;

        let weekUserPointTotalsGraph = [];
        users.map(user => {
            let data = [];
            for (let i = 1; i <= currentWeek; i++) {
                let weekName = ('week' + i + 'total');
                let points = parseInt(user[weekName]);
                if (i > 1) {
                    points = points + data[data.length - 1];
                }
                data.push(points);
                let pointInfo = {};
                pointInfo[user.firstname] = points;
                Object.assign(weekUserPointTotals[weekName], pointInfo);
            }
            //weekUserPointTotals[user] = data;
            let row = {
                label: user.firstname,
                fill: false,
                lineTension: 0.1,
                backgroundColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '0.4)'),
                borderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '1)'),
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '0.4)'),
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '1)'),
                pointHoverBorderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '0.4)'),
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data
            }
            weekUserPointTotalsGraph.push(row)
        })


        for (let i = 1; i <= currentWeek; i++) {
            let weekName = ('week' + i + 'total');
            const sortable = Object.entries(weekUserPointTotals[weekName])
                .sort(([, a], [, b]) => b - a)
                .reduce((r, [k, v]) => ({...r, [k]: v}), {});
            let arrayPairs = Object.entries(sortable);
            for (let n = 0; n < arrayPairs.length; n++) {
                let userName = arrayPairs[n][0];
                let rankings = userRankings[userName];
                rankings.push((n + 1));
                userRankings[userName] = rankings;
            }
        }

        let weekUserRankingsGraph = [];
        users.map(user => {
            let row = {
                label: user.firstname,
                fill: false,
                lineTension: 0.1,
                backgroundColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '0.4)'),
                borderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '1)'),
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '0.4)'),
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '1)'),
                pointHoverBorderColor: ('rgba(' + this.state.userColors[user.firstname].r + ',' + this.state.userColors[user.firstname].g + ',' + this.state.userColors[user.firstname].b + ',' + '1)'),
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: userRankings[user.firstname]
            }
            weekUserRankingsGraph.push(row)
        })
        let labelArray = (Array.from({length: currentWeek}, (x, i) => (i+1)));
        let data1 = {
            labels: labelArray,
            datasets: weekUserPointTotalsGraph,
        }

        let data2 = {
            labels: labelArray,
            datasets: weekUserRankingsGraph,
        }

        let contestants = await this.allContestants();
        contestants = contestants.filter(contestant => contestant.season === currentSeason)[0];

        this.setState({
            contestants: contestants,
            users: users,
            weekPoints: data1,
            weekRankings: data2
        });

    }

    async allContestants() {
        return (await axios.get(GetBaseURL() + '/contestants')).data
    }

    async allUsers() {
        return (await axios.get(GetBaseURL() + '/users/' + this.props.match.params.season)).data
    }

    async MasterInfo() {
        return (await axios.get(GetBaseURL() + '/masters')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            contestants: [],
            currentSeason: this.props.match.params.season,
            userColors: {
                Rachel: {r: 255, g: 0, b: 0},
                Shannon: {r: 255, g: 165, b: 0},
                Hope: {r: 255, g: 255, b: 0},
                Davis: {r: 0, g: 128, b: 0},
                Erik: {r: 0, g: 0, b: 255},
                Rebecca: {r: 75, g: 0, b: 130},
                Julia: {r: 238, g: 130, b: 238}
            },
            weekPoints: [],
            weekRankings: []
        };
    }

    render() {
        const options1 = {
            legend: {
                display: true,
                position: 'bottom',
            },
        };
        const options2 = {
            legend: {
                display: true,
                position: 'bottom',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        reverse: true,
                    }
                }]
            },
        };
        return (
            <div style={{position: "relative", margin: "auto", height: "90vh", width: "80vw", maxWidth: "900px"}}>
                <h3 style={{textAlign: "center"}}>Team Points</h3>
                <Line data={this.state.weekPoints} options={options1}/>
                <br/> <br/>
                <h3 style={{textAlign: "center"}}>Team Rankings</h3>
                <Line data={this.state.weekRankings} options={options2}/>
                <br/> <br/>
            </div>
        );
    };
}
