import React, { Component } from 'react';
import RosePic from "../images/HomepageRose.jpg";
import styled from 'styled-components';

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

export default class Home extends Component {
    render() {
        return (
            <div>
                <img src={RosePic} alt="rose" style={{width:  "100vw"}}/>
                <TextBelow>
                    Yes, there are other Bachelor/Bachelorette fantasy leagues that are well established where you can
                    earn or lose points for contestants on your "team" completing actions like getting a
                    rose or going on a horseback riding date or being shirtless on camera. However, most of
                    these leagues will penalize you if your contestant behaves poorly. We at Final Rose Fantasy
                    believe that the drama is often the best part of this guilt-pleasure TV show and have created
                    a new fantasy league that will reward you if your contestant cries (+10) or vomits (+12) or gets
                    a word bleeped out (+7). Contestants on the "most dramatic season ever" deserve to earn points
                    for causing drama, and this fantasy league website allows you to pick your team using our handy
                    "Pick Contestant" tool, and the website (and its dedicated host) will take care of the rest.
                </TextBelow>
            </div>
        );
    }
}

