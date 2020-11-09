import React from "react";
import { debounce } from "throttle-debounce";
import Image from "react-bootstrap/Image";
import styled from "styled-components";
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import ActionKey from '../ActionKey';
import DoubleClick from "./DoubleClick";

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
`;

const ContainerAction = styled.button`
    text-align: left;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 30px;
    background-color: ${props =>
        (props.type === 'NotUsed' && 'white') ||
        (props.type === 'OncePerEpisode' && 'lightcoral') ||
        (props.type === 'Firsts' && 'peachPuff') ||
        (props.type === 'MultiplePerEpisode' && 'paleturquoise') ||
        (props.type === 'OncePerContestant' && 'paleGreen')};  
`;

export default class ContestantScoreForm extends React.Component {
    componentDidMount() {
        this.fetchContestants();
    }

    async fetchContestants() {
        let contestants = await this.allContestants();
        let logistics = await this.LogisticsInfo();
        let currentWeek = logistics[0].currentWeek;
        let weekEliminatedName = 'week' + currentWeek + 'eliminated';
        let eliminatedContestants = (logistics[0])[weekEliminatedName];
        let currentContestants = contestants.filter(contestant => (!(eliminatedContestants.includes(contestant.nameLink))));

        this.setState({
            contestants: currentContestants,
            contestantsOrder: currentContestants.map(contestant => contestant.nameLink),
            currentWeek: currentWeek,
            weekActionsName: 'week' + currentWeek + 'actions',
            weekPointsName: 'week' + currentWeek + 'points',
            logistics: logistics[0]
        });
    }

    async allContestants() {
        return (await axios.get('http://localhost:5000/contestants')).data
    }

    async LogisticsInfo() {
        return (await axios.get('http://localhost:5000/logistics')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            textInput: "" ,
            contestants: [],
            contestantsOrder: [],
            actionKey: ActionKey,
            suggestions: ActionKey,
            currentContestant: null,
            hasTextInput: false,
            currentWeek: 0,
            weekActionsName: 'week0actions',
            weekPointsName: 'week0points',
            logistics: {},
        };
        this.autocompleteSearchDebounced = debounce(400, this.autocompleteSearch);
    }

    changeQuery = e => {
        this.setState({ textInput: e.target.value }, () => {
            this.autocompleteSearchDebounced(this.state.textInput)
        });

    };

    autocompleteSearch = textInput => {
        this._fetch(textInput);
    };

    _fetch = textInput => {
        console.log(textInput)
        const regex = new RegExp(`${textInput}`, 'i');
        const newSuggestions = this.state.actionKey
            .filter(action => regex.test(action.key))
        console.log(newSuggestions)
        this.setState( {suggestions: newSuggestions});
    };

    pickSubject = contestant => () => {
        this.setState({
            currentContestant: contestant,
            hasTextInput: true
        })
    }

    singleClickAdd= actionOption => () => {
        let weekActions = [...this.state.currentContestant[this.state.weekActionsName]];

        if (weekActions.some(action => action.id === actionOption.id)) {
            if (actionOption.category==='OncePerEpisode') {
                alert('Contestant has already earned points for this action this week')
                return;
            }
        }

        if (actionOption.category==='Firsts') {
            let firstsOccurred = this.state.logistics.firstsOccurred;
            if (firstsOccurred.includes(actionOption.key)) {
                alert('This first has already occurred')
                return;
            } else {
                firstsOccurred.push(actionOption.key)
                const updatedLogistics = {
                    ...this.state.logistics,
                    'firstsOccurred': firstsOccurred,
                };
                axios.put(('http://localhost:5000/updatelogistics'), {
                    updatedLogistics}).then(res => console.log(res.data))
                this.setState({'logistics': updatedLogistics})
            }
        } else if (actionOption.category==='OncePerContestant') {
            let contestantFirsts = this.state.currentContestant.oneTimeActions;
            if (contestantFirsts.includes(actionOption.key)) {
                alert('The contestant has already experienced this first')
                return;
            } else {
                contestantFirsts.push(actionOption.key)
                const updatedContestant = {
                    ...this.state.currentContestant,
                    'oneTimeActions': contestantFirsts,
                };
                axios.put(('http://localhost:5000/updatecontestant/'+updatedContestant.nameLink), {
                    updatedContestant
                })
                    .then(res => console.log(res.data));
            }
        }

        const updatedContestant = {
            ...this.state.currentContestant,
            [this.state.weekActionsName]: weekActions.concat(actionOption),
            [this.state.weekPointsName]: (parseInt(this.state.currentContestant[this.state.weekPointsName]) + parseInt(actionOption.points)).toString(),
            totalpoints: (parseInt(this.state.currentContestant.totalpoints) + parseInt(actionOption.points)).toString()
    };

        axios.put(('http://localhost:5000/updatecontestant/'+updatedContestant.nameLink), {
            updatedContestant
        })
            .then(res => console.log(res.data));

        const contestantIndex = this.state.contestantsOrder.indexOf(updatedContestant.nameLink)
        let updatedContestantsList = [...this.state.contestants]
        updatedContestantsList[contestantIndex] = {...updatedContestant}
        const newState = {
            ...this.state,
            currentContestant: null,
            hasTextInput: false,
            contestants: updatedContestantsList
        };
        this.setState(newState)
    }

    doubleClickRemove = actionOption => () => {
        let weekActions = [...this.state.currentContestant[this.state.weekActionsName]];

        if (!weekActions.some(action => action.id === actionOption.id)) {
            alert('Cannot remove an action that hasn’t been completed')
            return;
        }

        weekActions.splice(weekActions.indexOf(actionOption),1)
        console.log(weekActions)
        const updatedContestant = {
            ...this.state.currentContestant,
            [this.state.weekActionsName]: weekActions,
            [this.state.weekPointsName]: (parseInt(this.state.currentContestant[this.state.weekPointsName]) - parseInt(actionOption.points)).toString(),
            totalpoints: (parseInt(this.state.currentContestant.totalpoints) - parseInt(actionOption.points)).toString()
        };

        axios.put(('http://localhost:5000/updatecontestant/'+updatedContestant.nameLink), {
            updatedContestant
        })
            .then(res => console.log(res.data));

        const contestantIndex = this.state.contestantsOrder.indexOf(updatedContestant.nameLink)
        let updatedContestantsList = [...this.state.contestants]
        updatedContestantsList[contestantIndex] = {...updatedContestant}
        const newState = {
            ...this.state,
            currentContestant: null,
            hasTextInput: false,
            contestants: updatedContestantsList
        };
        this.setState(newState)
    }


    render() {
        return (
            <div>
                <h3>Current Week: {this.state.currentWeek}</h3>
                <Grid container direction="row" justify="center" alignItems="center">
                    {this.state.contestants.map(contestant => {
                            return (
                                <ContainerContestant key={contestant.name} onClick={this.pickSubject(contestant)}>
                                    <ContainerContestantPicture><Image src={contestant.imageLink} width="40" roundedCircle/></ContainerContestantPicture>
                                    <ContainerContestantName> {contestant.name} </ContainerContestantName>
                                </ContainerContestant>
                            )
                        })}
                </Grid>
                <hr />
                {(this.state.hasTextInput) && (
                    <div>
                        <div>
                        <input placeholder="Type action here" type="text" value={this.state.textInput} onChange={this.changeQuery}/>
                        </div>
                        <div>
                            {this.state.suggestions.map(actionOption => {return (
                                <DoubleClick key={actionOption.id} onClick={this.singleClickAdd(actionOption)} onDoubleClick={this.doubleClickRemove(actionOption)}>
                                    {(this.state.currentContestant[this.state.weekActionsName].some(action => action.id === actionOption.id)) ?
                                    <ContainerAction key={actionOption.id} type={actionOption.category}> {actionOption.key}</ContainerAction>:
                                        <ContainerAction key={actionOption.id} type={"NotUsed"}> {actionOption.key}</ContainerAction>
                                    }
                                </DoubleClick>)})}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
