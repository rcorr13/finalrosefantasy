import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import GetBaseURL from "./GetBaseURL";
import {useLocation} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import {createStyles} from "@material-ui/styles";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
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

const StickyTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#343a40",
        left: 0,
        position: "sticky",
        zIndex: theme.zIndex.appBar + 2,
    },
    body: {
        minWidth: "50px",
        left: 0,
        position: "sticky",
        zIndex: theme.zIndex.appBar + 1,
    }
}))(TableCell);

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#343a40",
        height: '10px',
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const StyledTableSortLabel = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '10px',
            fontWeight: 'bold',
            color: 'white',
            "&:hover": {
                color: 'lightgrey',
            },
            '&$active': {
                color: 'yellow',
            },
        },
        active: {},
        icon: {
            color: 'inherit !important'
        },
    })
)(TableSortLabel);

function EnhancedTableHead(props) {
    const {classes,order,orderBy,onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    let headCell1 = { id: 'firstname', numeric: false, label: 'Name', minWidth: 100, zIndex: 4};
return (
        <TableHead>
            <TableRow>
                <StickyTableCell
                        key={headCell1.id}
                        //align={headCell.numeric ? "right" : "left"}
                        //padding={headCell1.disablePadding ? "checkbox" : "default"}
                        sortDirection={orderBy === headCell1.id ? order : false}
                        width={300}
                >
                        <StyledTableSortLabel
                            active={orderBy === headCell1.id}
                            direction={orderBy === headCell1.id ? order : "asc"}
                            onClick={createSortHandler(headCell1.id)}
                        >
                            <p>&nbsp;&nbsp;</p>{headCell1.label}
                            {orderBy === headCell1.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </StyledTableSortLabel>
                </StickyTableCell>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        //align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={300}
                    >
                        <StyledTableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </StyledTableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "20px",
    },
    paper: {
        height: "85vh",
        width: "90vw",
        position: 'absolute',
        overflow: 'scroll',
    },
    tableContainer: {
        overflow: "initial",
    },
    cell_long: {
        width: 200,
        minWidth: 120,
    },
    firstCell: {
        //position: '-webkit-sticky',
        position: 'sticky',
        left: 0,
        zIndex: 1,
        backgroundColor: "#343a40",
        color: "white",
        width: 200,
    },

    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        position: "fixed",
        top: 20,
        width: 1,
    },
}));

function removeBachSeason(row) {
    if (typeof row === 'string' || row instanceof String) {
        return row
    } else {
        let newRow = [];
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
                const response = await axios.get(GetBaseURL() + "/users");
                let tableData = [];
                response.data.forEach(user => {
                    let rowData = (user.picksAndTeams.filter(seasonInfo => seasonInfo.season === season)[0]);
                    let row = Object.assign({firstname: user.firstname}, rowData);
                    tableData.push(row)
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
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map(
                                row => {
                                    return (
                                        <TableRow hover key={row.firstname}>
                                            <TableCell  align="left" style={{display: "table-cell", paddingLeft: "10px", fontWeight: "bold"}} className={classes.firstCell}>{row.firstname}</TableCell>
                                            <TableCell  align="left">{row.totalpoints}</TableCell>
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
