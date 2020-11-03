import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Image from 'react-bootstrap/Image'

const Container = styled.div`
    font-size: 2em;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
    display: flex;
    flex-direction: row;
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

export default class ContestantBox extends React.Component {
    render() {
        return (
            <Draggable draggableId={this.props.nameLink} index={this.props.index}>
                {/*
                - draggable requires draggableId and index
                - draggableProps - props need to be applied to component you want to move in response to user input
                - dragHandleProps - props that need to be applied to part of component that you want to use to
                control entire component - can use to drag large item by just a small part of it
                - snapshot - provides two properties - isDragging set to true when dragged and draggingOver will be set to the column ID of the column the object is over
                */}
                {(provided, snapshot) => (
                    <Container
                        isDragging={snapshot.isDragging}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Container2> {this.props.nameLink} </Container2>
                    </Container>
                )}
            </Draggable>
        );
    }
}