import React from "react";
import '@atlaskit/css-reset';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {logoutUser} from "../actions/authentication";
import {withRouter} from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";

const Container = styled.div`
    display: flex;
    `;

const SmallButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-item: center;
  font-size: 1.5em;
  border-radius: 10px;
  height: 50px;
  min-width: 100px;
  margin-top: 90px;
`
const ContainerColumn = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 500px;
    display: flex;
    flex-direction: column;
    `;

const Title = styled.h3`
    font-size: 2.5em;
    text-align: center;
    padding: 8px;
    `;

const ContestantList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
    flex-grow: 1;
    min-height: 150px; 
    `;

const Container1 = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
`;

const Container2 = styled.div`
    align-items: center;
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
`;

const ContainerContestant = styled.div`
    font-size: 2em;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
    display: flex;
    flex-direction: row;
`;

class ContestantPicker4 extends React.Component {

    componentDidMount() {
        this.fetchContestants();
    }

    async fetchContestants() {
        let contestants = await this.allContestants();
        let users = await this.allUsers();
        const {isAuthenticated, user} = this.props.auth;
        user.contestants = (users.find(userID => userID._id==user.id)).contestants;
        console.log(user);
        const unselectedContestants = contestants
            .map(contestantInfo => contestantInfo.nameLink)
            .filter(contestantLink => !(user.contestants.includes(contestantLink)));

        this.setState({
            contestants: contestants,
            user: user,
        });

        const columnsUpdate = {...this.state.columns};
        columnsUpdate.column1.contestantIndices = unselectedContestants;
        columnsUpdate.column2.contestantIndices = (users.find(userID => userID._id==user.id)).contestants;
        this.setState({columnsUpdate})
    }

    async allContestants() {
        return (await axios.get('http://localhost:5000/contestants')).data
    }

    async allUsers() {
        return (await axios.get('http://localhost:5000/users')).data
    }

    constructor(props) {
        super(props);
        const {isAuthenticated, user} = this.props.auth;
        this.state = {
            user: user,
            contestants: [],
            columns: {
                'column1': {
                    id: 'column1',
                    title: 'All Contestants',
                    contestantIndices: []
                },
                'column2': {
                    id: 'column2',
                    title: 'My Picks',
                    contestantIndices: user.contestants,
                },
            },
            columnOrder: ['column1', 'column2'],
        };
    }

    onDragEnd = result => {
        // updates contestant list with new order of contestants
        const {destination, source, draggableId} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        // dropped in same spot
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];



        if (start === finish) {
            const newContestantIds = Array.from(start.contestantIndices);

            newContestantIds.splice(newContestantIds.indexOf(draggableId), 1);

            newContestantIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                contestantIndices: newContestantIds,
            }

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        // moving from one list to the other
        const startContestantIds = Array.from(start.contestantIndices);
        //console.log(startContestantIds)
        startContestantIds.splice(startContestantIds.indexOf(draggableId), 1);
        //console.log(startContestantIds)

        const newStart = {
            ...start,
            contestantIndices: startContestantIds,
        };

        const finishContestantIds = Array.from(finish.contestantIndices);
        console.log(finishContestantIds)
        finishContestantIds.splice(destination.index, 0, draggableId);
        console.log(finishContestantIds)

        const newFinish = {
            ...finish,
            contestantIndices: finishContestantIds,
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };


        this.setState(newState)
        return;
    };

    handleClick = () => {
        const contestantsPickedIds = this.state.columns["column2"].contestantIndices;
        //let result3 = contestantsPickedIds
        //    .map(contestant => `${contestant} is picked`)
        //console.log(contestantsPickedIds)

        const {isAuthenticated, user} = this.props.auth;

        const updatedUser = {
            ...user,
            contestants: contestantsPickedIds,
        };
        console.log(updatedUser)

        /*
        axios.put(('http://localhost:5000/helloworld'), {
            updatedUser
        }).then(res => console.log(res.data));

        console.log(this.state)
         */

        axios.put(('http://localhost:5000/updateuser/'+user.id), {
            updatedUser
        })
            .then(res => console.log(res.data));

    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Container>
                    {this.state.columnOrder.map(columnId => {
                        const column = this.state.columns[columnId];
                        const contestantsColumn = column.contestantIndices.map(contestantIndex => (this.state.contestants.find(element => element.nameLink == contestantIndex)))
                        const contestantNames = [];
                        const contestantImages = [];
                        const userStr = JSON.stringify(contestantsColumn);
                        JSON.parse(userStr, (key, value) => {
                            if (key === 'nameLink') {
                                //console.log(value);
                                return contestantNames.push(value);
                            } else if (key === 'imageLink') {
                                return contestantImages.push(value);
                            }
                        });
                        return (
                            <ContainerColumn key={column.id}>
                                <Title>{column.title}</Title>
                                <Droppable droppableId={column.id} >
                                    {(provided,snapshot) => (
                                        <ContestantList
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            isDraggingOver={snapshot.isDraggingOver}
                                        >
                                            {contestantNames.map((nameLink,index) => {
                                                return (
                                                    <Draggable key={nameLink} draggableId={nameLink} index={index}>
                                                        {(provided, snapshot) => (
                                                            <ContainerContestant
                                                                isDragging={snapshot.isDragging}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <Container1><Image src={((this.state.contestants.find(element => element.nameLink == nameLink))).imageLink} width="70" roundedCircle/></Container1>
                                                                <Container2> {nameLink.replace('-', ' ')} </Container2>
                                                            </ContainerContestant>)}
                                                    </Draggable>)})
                                            }
                                            {provided.placeholder}
                                        </ContestantList>)}
                                </Droppable>
                            </ContainerColumn>
                        )
                    })}

                    <SmallButton variant="primary" onClick={this.handleClick}> Submit </SmallButton>
                </Container>
            </DragDropContext>

        );
    };
}

ContestantPicker4.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(ContestantPicker4));


/*
                                            {JSON.stringify(contestantsColumn.map(contestant => contestant))}

<Droppable droppableId={column.id}>
                                    {(provided,snapshot) => (
                                        <ContestantList
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            isDraggingOver={snapshot.isDraggingOver}
                                        >
                                            return (
                                            {contestants.map((contestant, index) => (
                                                <Draggable draggableId={contestant._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <ContainerContestant
                                                            isDragging={snapshot.isDragging}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Container1><Image src={contestant.imageLink} alt={contestant.nameLink} width="70" roundedCircle/></Container1>
                                                            <Container2> {contestant.name} </Container2>
                                                        </ContainerContestant>
                                                    )}
                                                </Draggable>
                                            ))})
                                            {provided.placeholder}
                                        </ContestantList>
                                    )}
                                </Droppable>

 */