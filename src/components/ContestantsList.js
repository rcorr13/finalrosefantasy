import React, {useEffect, useState} from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import GetBaseURL from "./GetBaseURL";
import {useLocation} from "react-router-dom";
import {getComparator,stableSort,useStyles, EnhancedTableHead} from "./TableFunctions"

const headCells = [
    { id: 'id', numeric: false, label: 'Name', minWidth: 200,  zIndex: 4},
    { id: 'image', numeric: false, label: 'Image', maxWidth: 70 },
    { id: 'age', label: 'Age', minWidth: 50 },
    { id: 'job', numeric: false, label: 'Job', minWidth: 50 },
    { id: 'city', numeric: false, label: 'City', minWidth: 50 },
    { id: 'stateUS', numeric: false, label: 'State', minWidth: 50 },
    { id: 'totalpoints', numeric: true, label: 'Total Points', minWidth: 100 },
    { id: 'week1points', numeric: true, label: 'Week 1 Points', minWidth: 700 },
    { id: 'week1actions', numeric: false, label: 'Week 1 Actions', minWidth: 150 },
    { id: 'week2points', numeric: true, label: 'Week 2 Points', minWidth: 100 },
    { id: 'week2actions', numeric: false, label: 'Week 2 Actions', minWidth: 150 },
    { id: 'week3points', numeric: true, label: 'Week 3 Points', minWidth: 100 },
    { id: 'week3actions', numeric: false, label: 'Week 3 Actions', minWidth: 150 },
    { id: 'week4points', numeric: true, label: 'Week 4 Points', minWidth: 100 },
    { id: 'week4actions', numeric: false, label: 'Week 4 Actions', minWidth: 150 },
    { id: 'week5points', numeric: true, label: 'Week 5 Points', minWidth: 100 },
    { id: 'week5actions', numeric: false, label: 'Week 5 Actions', minWidth: 150 },
    { id: 'week6points', numeric: true, label: 'Week 6 Points', minWidth: 100 },
    { id: 'week6actions', numeric: false, label: 'Week 6 Actions', minWidth: 150 },
    { id: 'week7points', numeric: true, label: 'Week 7 Points', minWidth: 100 },
    { id: 'week7actions', numeric: false, label: 'Week 7 Actions', minWidth: 150 },
    { id: 'week8points', numeric: true, label: 'Week 8 Points', minWidth: 100 },
    { id: 'week8actions', numeric: false, label: 'Week 8 Actions', minWidth: 150 },
    { id: 'week9points', numeric: true, label: 'Week 9 Points', minWidth: 100 },
    { id: 'week9actions', numeric: false, label: 'Week 9 Actions', minWidth: 150 },
    { id: 'week10points', numeric: true, label: 'Week 10 Points', minWidth: 100 },
    { id: 'week10actions', numeric: false, label: 'Week 10 Actions', minWidth: 150 },
    { id: 'week11points', numeric: true, label: 'Week 11 Points', minWidth: 100 },
    { id: 'week11actions', numeric: false, label: 'Week 11 Actions', minWidth: 150 },
    { id: 'week12points', numeric: true, label: 'Week 12 Points', minWidth: 100 },
    { id: 'week12actions', numeric: false, label: 'Week 12 Actions', minWidth: 150 },
    { id: 'week13points', numeric: true, label: 'Week 13 Points', minWidth: 100 },
    { id: 'week13actions', numeric: false, label: 'Week 13 Actions', minWidth: 150 },
    { id: 'week14points', numeric: true, label: 'Week 14 Points', minWidth: 100 },
    { id: 'week14actions', numeric: false, label: 'Week 14 Actions', minWidth: 150 },
    { id: 'week15points', numeric: true, label: 'Week 15 Points', minWidth: 100 },
    { id: 'week15actions', numeric: false, label: 'Week 15 Actions', minWidth: 150 },
    { id: 'week16points', numeric: true, label: 'Week 16 Points', minWidth: 100 },
    { id: 'week16actions', numeric: false, label: 'Week 16 Actions', minWidth: 150 },

];

export default function EnhancedTable() {
    const season = useLocation().pathname.split('/').pop();

    const [rows, setContestants] = useState([])

    useEffect(function() {
        async function getContestants() {
            try {
                const response = await axios.get(GetBaseURL() +  '/contestants');
                const contestants = response.data;
                setContestants(contestants.filter(contestant => contestant.season === season));
            } catch(error) {
                console.log('error', error);
            }
        }
        getContestants();
    }, []);

    rows.forEach(row => {
        (row.totalpoints = parseInt(row.totalpoints));
        (row.week1points = parseInt(row.week1points));
        (row.week2points = parseInt(row.week2points));
        (row.week3points = parseInt(row.week3points));
        (row.week4points = parseInt(row.week4points));
        (row.week5points = parseInt(row.week5points));
        (row.week6points = parseInt(row.week6points));
        (row.week7points = parseInt(row.week7points));
        (row.week8points = parseInt(row.week8points));
        (row.week9points = parseInt(row.week9points));
        (row.week10points = parseInt(row.week10points));
        (row.week11points = parseInt(row.week11points));
        (row.week12points = parseInt(row.week12points));
        (row.week13points = parseInt(row.week13points));
        (row.week14points = parseInt(row.week14points));
        (row.week15points = parseInt(row.week15points));
        (row.week16points = parseInt(row.week16points));
    })

    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("name");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map(
                                (row) => {
                                    return (
                                        <TableRow hover key={row.name}>
                                            <TableCell align="left" className={classes.cell_long} style={{display: "table-cell", paddingLeft: "10px", fontWeight: "bold", color: (row.status === "on") ? 'white' : 'red'}} className={classes.firstCell}>{row.name}</TableCell>
                                            <TableCell align="left" className={classes.cell_long} ><img src={row.imageLink} width="100" alt={row.nameLink}/></TableCell>
                                            <TableCell align="left" className={classes.cell_short}>{row.age}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.job}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.city}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.stateUS}</TableCell>
                                            <TableCell align="left" className={classes.cell_short}>{row.totalpoints}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week1points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week1actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week2points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week2actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week3points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week3actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week4points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week4actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week5points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week5actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week6points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week6actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week7points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week7actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week8points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week8actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week9points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week9actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week10points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week10actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week11points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week11actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week12points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week12actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week13points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week13actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week14points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week14actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week15points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week15actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.week16points}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{(row.week16actions).map((action, index) => <div key={action.key + index}>{action.key}</div>)}</TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}
