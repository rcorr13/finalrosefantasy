import React, { Component } from 'react';
import RosePic from "../images/HomepageRose.jpg";
import styled from 'styled-components';
import {Nav} from "react-bootstrap";

const TextBelow = styled.div`
    font-size: 1em;
    font-weight: normal;
    text-align: left;
    padding: 8px;
    margin-left: 20px;
    display: inline-flex;
    width: 90%;
`;

export default class HowTo extends Component {
    render() {
        return (
            <div>
                <br />
                <h2 style={{textAlign: "center"}}>How it works:</h2>
                <TextBelow>
                    <span> &emsp; Before the first episode of the season, each person will sign up for the website and use
                        the <a href="/pickcontestants" >Pick Contestants</a> tool to drag and drop their ideal
                        contestants onto their team (with contestants higher on the list being a higher priority for the
                        user). Contestants can be on no more than 3 teams, and for the first week user picking order
                        is based on results from the prior season's league. After each episode, the scores for each
                        contestant will be calculated according to the <a href="/scoringrules" >Scoring Rules</a> and
                        the <a href="/standings" >Standings</a> will be updated.
                        <br /><br />
                        &emsp; If any of your contestants are eliminated in a given week, you can update your preference
                        order in the <a href="/pickcontestants" >Pick Contestants</a> tool (where contestants currently
                        on your team are highlighted in green), and new teams will be assigned based on your preferences,
                        with users with the lowest current point totals picking first. The winning user for this
                        season's fantasy league will hopefully earn a trophy that I still need to craft.
                        <br /><br />
                        &emsp; The Bachelorette on ABC this fall is on Tuesdays at 8 PM and all updated teams need to
                        be posted before then. Additionally, we would like to acknowledge the people at <a
                            href="https://www.bachbracket.com/">Bach Bracket</a> because some of our rules were
                        inspired by theirs (although the point values and general design of the leagues are very
                        different).
                    </span>
                </TextBelow>
            </div>
        );
    }
}

