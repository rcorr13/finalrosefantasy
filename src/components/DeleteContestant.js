import React from "react";
import Image from "react-bootstrap/Image";
import styled from "styled-components";
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import GetBaseURL from "./GetBaseURL";

const ContainerContestantPicture = styled.div`
    margin-left: 5px;
    display: flex;
    flex-direction: column;
`;

const ContainerContestantName = styled.div`
    align-items: center;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
`;

const ContainerContestant = styled.button`
    font-size: 1em;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    width: 200px;
`;

export default class DeleteContestant extends React.Component {
    componentDidMount() {
        this.fetchContestants();
    }

    async fetchContestants() {
        let contestants = await this.allContestants();

        this.setState({
            contestants: contestants,
        });
    }

    async allContestants() {
        return (await axios.get(GetBaseURL() + '/contestants')).data
    }


    constructor(props) {
        super(props);
        this.state = {
            contestants: [],
        };
    }

    deleteContestant = contestant => () => {
        axios.delete((GetBaseURL() + '/delete/'+contestant.nameLink))
            .then(res => console.log(res.data));

        let contestantsUpdated = this.state.contestants.filter(person => (person.nameLink !== contestant.nameLink))
        this.setState({
            contestants: contestantsUpdated,
        })

    }

    render() {
        return (
            <div>
                <Grid container direction="column" justify="center" alignItems="center">
                    {this.state.contestants.map(contestant => {
                        return (
                            <ContainerContestant key={contestant.name} onClick={this.deleteContestant(contestant)}>
                                <ContainerContestantPicture><Image src={contestant.imageLink} width="40" roundedCircle/></ContainerContestantPicture>
                                <ContainerContestantName> {contestant.name} </ContainerContestantName>
                            </ContainerContestant>
                        )
                    })}
                </Grid>
            </div>
        );
    }
}
