import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import {createStyles} from "@material-ui/styles";

export function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const StickyTableCell = withStyles((theme) => ({
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

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#343a40",
        height: '10px',
        fontSize: 20,
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

export const StyledTableSortLabel = withStyles((theme: Theme) =>
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

export const useStyles = makeStyles((theme) => ({
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
    cell_short: {
        width: 100,
        minWidth: 80,
    },
    firstCell: {
        position: 'sticky',
        zIndex: 1,
        backgroundColor: "#343a40",
        color: "white",
        width: 100,
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

export function EnhancedTableHead(props) {
    const {classes,order,orderBy,onRequestSort,headCells} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const headCell1 = headCells[0];
    return (
        <TableHead>
            <TableRow>
                <StickyTableCell
                    key={headCell1.id}
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
                {headCells.slice(1).map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        //align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={300}
                        style={{fontSize: headCell.id.includes("emoji") ? "35px" : "14px"}}
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
};

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
};