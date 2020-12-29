import React, { Component } from 'react';
import axios from "axios";
import GetBaseURL from "./GetBaseURL";

export default class ScoringRules extends Component {
    componentDidMount() {
        this.fetchInfo();
    }

    async fetchInfo() {
        let logistics = await this.LogisticsInfo();
        let currentLogistics = logistics.filter(option => option.season === this.props.match.params.season)[0];

        this.setState({
            logistics: currentLogistics,
            ActionKey: currentLogistics.seasonKey,
            ActionGroups: currentLogistics.seasonActionGroups,
        });
    }

    async LogisticsInfo() {
        return (await axios.get(GetBaseURL() + '/logistics')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            logistics: [],
            ActionKey: [],
            ActionGroups: [],
        };
    }

    render() {
        return (
            <div className="container">
                {this.state.ActionGroups.map(group => {return (
                    <div key={group.group}>
                        <table className="table table-hover" style={{captionSide: "top"}}>
                            <caption style={{captionSide: "top", textAlign: "center", color: "black"}}> {group.group} </caption>
                            <thead>
                            <tr>
                                <th>Action</th>
                                <th>Points</th>
                            </tr>
                            </thead>
                            {group.ids
                                .map(idNum => (this.state.ActionKey.filter(actionOption => actionOption.id === idNum))[0])
                                .map(actionOption => {return (
                                    <tbody key={('tbody'+actionOption.id)}>
                                    <tr key={('trbody'+actionOption.id)}>
                                        <td key={('key'+ actionOption.id)}>{actionOption.key}</td>
                                        <td key={('points' + actionOption.id)}>{actionOption.points}</td>
                                    </tr>
                                    </tbody>)})}

                        </table>
                    </div>)})}
            </div>
        );
    }
}

