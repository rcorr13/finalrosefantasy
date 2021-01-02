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
import {
    useLocation
} from "react-router-dom";
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
    { id: 'image', numeric: false, label: 'Image', maxWidth: 70 },
    { id: 'age', label: 'Age', minWidth: 50 },
    { id: 'job', numeric: false, label: 'Job', minWidth: 50 },
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
            color: 'white',
            fontWeight: 'bold',
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
    let headCell1 = { id: 'name', numeric: false, label: 'Name', minWidth: 200,  zIndex: 4};
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
                            color={"white"}
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
        height: "80vh",
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


export default function EnhancedTable() {
    const season = useLocation().pathname.split('/').pop();

    const [rows, setContestants] = useState([])

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
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map(
                                (row) => {
                                    return (
                                        <TableRow hover key={row.name}>
                                            <TableCell align="left" className={classes.cell_long} style={{display: "table-cell", paddingLeft: "10px", fontWeight: "bold", color: (row.status === "on") ? 'white' : 'red'}} className={classes.firstCell}>{row.name}</TableCell>
                                            <TableCell align="left" className={classes.cell_long} ><img src={row.imageLink} width="100" alt={row.nameLink}/></TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.age}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.job}</TableCell>
                                            <TableCell align="left" className={classes.cell_long}>{row.totalpoints}</TableCell>
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
