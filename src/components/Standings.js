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
import {getComparator, stableSort, useStyles, EnhancedTableHead } from "./TableFunctions"

const headCells = [
    { id: 'firstname', numeric: false, label: 'Name', minWidth: 100, zIndex: 4},
    { id: 'totalpoints', numeric: true, label: 'Total Points', minWidth: 100 },
    { id: 'week1team', numeric: false, label: 'Week 1 Team', minWidth: 500 },
    { id: 'week1total', numeric: true, label: 'Week 1 Points', minWidth: 200 },
    { id: 'week2team', numeric: false, label: 'Week 2 Team', minWidth: 150 },
    { id: 'week2total', numeric: true, label: 'Week 2 Points', minWidth: 150 },
    { id: 'week3team', numeric: false, label: 'Week 3 Team', minWidth: 150 },
    { id: 'week3total', numeric: true, label: 'Week 3 Points', minWidth: 150 },
    { id: 'week4team', numeric: false, label: 'Week 4 Team', minWidth: 150 },
    { id: 'week4total', numeric: true, label: 'Week 4 Points', minWidth: 150 },
    { id: 'week5team', numeric: false, label: 'Week 5 Team', minWidth: 150 },
    { id: 'week5total', numeric: true, label: 'Week 5 Points', minWidth: 150 },
    { id: 'week6team', numeric: false, label: 'Week 6 Team', minWidth: 150 },
    { id: 'week6total', numeric: true, label: 'Week 6 Points', minWidth: 150 },
    { id: 'week7team', numeric: false, label: 'Week 7 Team', minWidth: 150 },
    { id: 'week7total', numeric: true, label: 'Week 7 Points', minWidth: 150 },
    { id: 'week8team', numeric: false, label: 'Week 8 Team', minWidth: 150 },
    { id: 'week8total', numeric: true, label: 'Week 8 Points', minWidth: 150 },
    { id: 'week9team', numeric: false, label: 'Week 9 Team', minWidth: 150 },
    { id: 'week9total', numeric: true, label: 'Week 9 Points', minWidth: 150 },
    { id: 'week10team', numeric: false, label: 'Week 10 Team', minWidth: 150 },
    { id: 'week10total', numeric: true, label: 'Week 10 Points', minWidth: 150 },
    { id: 'week11team', numeric: false, label: 'Week 11 Team', minWidth: 150 },
    { id: 'week11total', numeric: true, label: 'Week 11 Points', minWidth: 150 },
    { id: 'week12team', numeric: false, label: 'Week 12 Team', minWidth: 150 },
    { id: 'week12total', numeric: true, label: 'Week 12 Points', minWidth: 150 },
    { id: 'week13team', numeric: false, label: 'Week 13 Team', minWidth: 150 },
    { id: 'week13total', numeric: true, label: 'Week 13 Points', minWidth: 150 },
    { id: 'week14team', numeric: false, label: 'Week 14 Team', minWidth: 150 },
    { id: 'week14total', numeric: true, label: 'Week 14 Points', minWidth: 150 },
];

function removeBachSeason(row) {
    if (typeof row === 'string' || row instanceof String) {
        console.log(row)
        return row
    } else {
        let newRow = [];
        if (row.includes(null) == true) {
            row = row.map(item => item === null ? 'MISSING CONTESTANT-Bachelor-00' : item);
        };
        row.forEach(nameLink => newRow.push(nameLink.split('-').slice(-4, -2).join(' ')));
        return (newRow.join(', '))
    }
}


export default function EnhancedTable() {
    const season = useLocation().pathname.split('/').pop();

    const [rows, setUsers] = useState([])

    useEffect(function() {
        async function getUsers() {
            try {
                const response = await axios.get(GetBaseURL() + "/users/" + season);
                let tableData = [];
                response.data.forEach(row => {
                    if (Object.keys(row).length > 3) {
                        tableData.push(row)
                    }
                })
                setUsers(tableData);
            } catch(error) {
                console.log('error', error);
            }
        }
        getUsers();
    }, []);

    rows.forEach(row => {
        (row.totalpoints = parseInt(row.totalpoints));
        (row.week1team = removeBachSeason(row.week1team));
        (row.week2team = removeBachSeason(row.week2team));
        (row.week3team = removeBachSeason(row.week3team));
        (row.week4team = removeBachSeason(row.week4team));
        (row.week5team = removeBachSeason(row.week5team));
        (row.week6team = removeBachSeason(row.week6team));
        (row.week7team = removeBachSeason(row.week7team));
        (row.week8team = removeBachSeason(row.week8team));
        (row.week9team = removeBachSeason(row.week9team));
        (row.week10team = removeBachSeason(row.week10team));
        (row.week11team = removeBachSeason(row.week11team));
        (row.week12team = removeBachSeason(row.week12team));
        (row.week13team = removeBachSeason(row.week13team));
        (row.week14team = removeBachSeason(row.week14team));
        (row.week1total = parseInt(row.week1total));
        (row.week2total = parseInt(row.week2total));
        (row.week3total = parseInt(row.week3total));
        (row.week4total = parseInt(row.week4total));
        (row.week5total = parseInt(row.week5total));
        (row.week6total = parseInt(row.week6total));
        (row.week7total = parseInt(row.week7total));
        (row.week8total = parseInt(row.week8total));
        (row.week9total = parseInt(row.week9total));
        (row.week10total = parseInt(row.week10total));
        (row.week11total = parseInt(row.week11total));
        (row.week12total = parseInt(row.week12total));
        (row.week13total = parseInt(row.week13total));
        (row.week14total = parseInt(row.week14total));
    })

    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("firstname");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer width="85%" height="85%" classes={{ root: classes.tableContainer }} >
                    <Table className={classes.table} stickyHeader={true}>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map(
                                row => {
                                    return (
                                        <TableRow hover key={row.firstname}>
                                            <TableCell  align="left" style={{display: "table-cell", paddingLeft: "10px", fontWeight: "bold"}} className={classes.firstCell}>{row.firstname}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.totalpoints}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week1team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week1total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week2team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week2total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week3team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week3total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week4team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week4total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week5team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week5total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week6team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week6total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week7team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week7total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week8team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week8total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week9team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week9total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week10team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week10total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week11team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week11total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week12team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week12total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week13team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week13total}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{(row.week14team)}</TableCell>
                                            <TableCell  align="left" className={classes.cell_long}>{row.week14total}</TableCell>
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
