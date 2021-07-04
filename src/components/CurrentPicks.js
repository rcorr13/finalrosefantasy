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
    { id: 'pick1', numeric: false, label: 'Pick 1', minWidth: 500 },
    { id: 'pick2', numeric: false, label: 'Pick 2', minWidth: 150 },
    { id: 'pick3', numeric: false, label: 'Pick 3', minWidth: 150 },
    { id: 'pick4', numeric: false, label: 'Pick 4', minWidth: 150 },
    { id: 'pick5', numeric: false, label: 'Pick 5', minWidth: 150 },
    { id: 'pick6', numeric: false, label: 'Pick 6', minWidth: 150 },
    { id: 'pick7', numeric: false, label: 'Pick 7', minWidth: 150 },
    { id: 'pick8', numeric: false, label: 'Pick 8', minWidth: 150 },
    { id: 'pick9', numeric: false, label: 'Pick 9', minWidth: 150 },
    { id: 'pick10', numeric: false, label: 'Pick 10', minWidth: 150 },
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
        width: "50%",
        marginLeft: "25px",
        marginRight: "25px",
    },
    paper: {
        height: "85vh",
        width: "95vw",
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
        zIndex: 1,
        left: 0,
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
        return (newRow)
    }
}

function colorContestant(pick, currentTeam, contestants) {
    let textcolor = 'black'
    let textdecoration = 'none'

    try {
        const fullPath = useLocation().pathname.split('/')
        const currentWeek = fullPath.pop();
        const season = fullPath.pop();
        console.log(contestants)
        const namelink = pick.replace(/\s+/g, '-') + "-" + season;
        let contestantrow = contestants.filter(contestant => ((contestant.nameLink === namelink) && (contestant.season === season)))[0];
        //console.log(contestantrow.status)
        //console.log(currentTeam)
        if (contestantrow.status != "on") {
            textcolor = 'red'
            textdecoration = 'line-through'
        }
        if (currentTeam.includes(pick)) {
            textcolor = 'green'
        }

        return ({color: textcolor, textDecoration: textdecoration, textDecorationColor: 'red'})
    } catch(error) {
        return({color: textcolor})
    }
    //return({color: 'blue', textDecoration: 'line-through'})
}


export default function EnhancedTable() {
    const fullPath = useLocation().pathname.split('/')
    const currentWeek = fullPath.pop();
    const season = fullPath.pop();

    const [rows, setUsers] = useState([])

    useEffect(function() {
        async function getUsers() {
            try {
                const response = await axios.get(GetBaseURL() + "/users");
                let tableData = [];
                response.data.forEach(user => {
                    let rowData = (user.picksAndTeams.filter(seasonInfo => seasonInfo.season === season)[0]);
                    let row = Object.assign({firstname: user.firstname}, rowData);
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

    const [contestants, setContestants] = useState([])

    useEffect(function() {
        async function getContestants() {
            try {
                //const response = await axios.get("http://localhost:5000/contestants");
                const response = await axios.get(GetBaseURL() +  '/contestants');
                const contestants = response.data;
                setContestants(contestants.filter(contestant => contestant.season === season));
            } catch(error) {
                console.log('error', error);
            }
        }
        getContestants();
    }, []);

    console.log(rows)

    rows.forEach(row => {
        (row.totalpoints = parseInt(row.totalpoints));
        (row.pick1 = removeBachSeason(row.picks)[0]);
        (row.pick2 = removeBachSeason(row.picks)[1]);
        (row.pick3 = removeBachSeason(row.picks)[2]);
        (row.pick4 = removeBachSeason(row.picks)[3]);
        (row.pick5 = removeBachSeason(row.picks)[4]);
        (row.pick6 = removeBachSeason(row.picks)[5]);
        (row.pick7 = removeBachSeason(row.picks)[6]);
        (row.pick8 = removeBachSeason(row.picks)[7]);
        (row.pick9 = removeBachSeason(row.picks)[8]);
        (row.pick10 = removeBachSeason(row.picks)[9]);
        (row.currentTeam = removeBachSeason(row[['week',currentWeek,'team'].join('')]))
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
                                            <TableCell  align="left" style={colorContestant(row.pick1, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick1)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick2, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick2)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick3, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick3)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick4, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick4)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick5, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick5)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick6, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick6)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick7, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick7)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick8, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick8)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick9, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick9)}</TableCell>
                                            <TableCell  align="left" style={colorContestant(row.pick10, row.currentTeam, contestants)} className={classes.cell_long}>{(row.pick10)}</TableCell>
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
