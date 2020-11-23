import React, { Component } from 'react';
import styled from 'styled-components';
import ActionKey from '../ActionKey';

const TextBelow = styled.div`
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    padding: 8px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    width: 90%;
`;

let ActionGroups = [
    {group: 'Actions - Multiple Per Episode', ids: [1,2,3,11,12,13,14,15,16,17,18,19,20,21,22,23,24]},
    {group: 'Actions - Once Per Contestant Per Episode', ids: [4,5,6,9,10,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,49,41,42,43,44,45,7,8,46,47,48]},
    {group: 'Words and Phrases - Once Per Contestant Per Episode', ids: [87,88,89,90,91,92,93,94]},
    {group: 'Feelings/Revelations - Once Per Contestant', ids: [49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,95,96]},
    {group: 'Firsts - Once Per Season', ids: [64,65,66,67,68,69,70,71,72,73,74,75,76]},
    {group: 'Limos/First Episode', ids: [77,78,79,80,81,82,83,84,85,86]},
]

export default class ScoringRules extends Component {
    render() {
        return (
            <div className="container">
                {ActionGroups.map(group => {return (
                    <div key={group.group}>
                        <table className="table table-hover" style={{captionSide: "top"}}>
                            <caption style={{captionSide: "top", textAlign: "center", color: "black"}}> {group.group} </caption>
                            <thead>
                            <tr>
                                <th>Action</th>
                                <th>Points</th>
                            </tr>
                            </thead>
                            {ActionKey
                                .filter(actionOption => group.ids.includes(actionOption.id))
                                .map(actionOption => {return (
                                    <tbody key={(actionOption.key+'tbody')}>
                                    <tr key={(actionOption.key+'tr')}>
                                        <td key={(actionOption.key+'key')}>{actionOption.key}</td>
                                        <td key={(actionOption.key+'points')}>{actionOption.points}</td>
                                    </tr>
                                    </tbody>)})}
                        </table>
                    </div>)})}
            </div>
        );
    }
}

