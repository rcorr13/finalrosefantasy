import React, {useEffect, useState} from "react";
import axios from "axios";
import GetBaseURL from "./GetBaseURL";
import {getComparator,stableSort,useStyles, EnhancedTableHead } from "./TableFunctions"
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const headCells = [
    { id: 'firstname', numeric: false, label: 'Name'},
    { id: 'sumpoints', numeric: true, label: 'Total Points'},
    { id: 'firsts_emoji', numeric: true, label: <span role="img" aria-label="gold">🥇</span>},
    { id: 'seconds_emoji', numeric: true, label: <span role="img" aria-label="silver">🥈</span>},
    { id: 'thirds_emoji', numeric: true, label: <span role="img" aria-label="bronze">🥉</span>},
    { id: 'totalmedals', numeric: true, label: 'Total Medals'},
];

export default function Leaderboard() {
    const [rankings, setRankings] = useState([])

    useEffect(function() {
        async function getRankings() {
            try {
                const response1 = await axios.get(GetBaseURL() +  '/logistics');
                const logistics = response1.data;
                const seasonsList = logistics.reduce((seasonsList, seasonInfo) => {
                    if (seasonInfo.status == "Done") {
                        seasonsList.push(seasonInfo.season);
                    }
                    return seasonsList;
                }, []);
                const response = await axios.get(GetBaseURL() + "/users");
                const users = response.data;

                let rankingsTotal = new Object();
                users.forEach(user => {
                    rankingsTotal[user.firstname] = {firstname: user.firstname, sumpoints: 0, firsts_emoji: 0, seconds_emoji: 0, thirds_emoji: 0, totalmedals: 0};
                })

                seasonsList.forEach(season => {
                    const seasonObj = new Object();
                    users.forEach(user => {
                        seasonObj[user.firstname] = {};
                        if ((logistics.filter(option => option.season === season)[0]).users.includes(user.firstname)) {
                            seasonObj[user.firstname].seasonpoints = parseInt(user.picksAndTeams.filter(info => info.season === season)[0].totalpoints);
                            rankingsTotal[user.firstname].sumpoints += seasonObj[user.firstname].seasonpoints;
                        } else {
                            seasonObj[user.firstname].seasonpoints = 0;
                        };
                        console.log(seasonObj)
                    })

                    let scores = new Set(Object.keys(seasonObj).map(function (key) {
                        return seasonObj[key].seasonpoints;
                    }));
                    let ordered_scores = Array.from(scores).sort(function(a, b) {
                        return b - a;
                    });
                    Object.keys(seasonObj).forEach(function (key) {
                        let user = seasonObj[key];
                        user.rank = ordered_scores.indexOf(user.seasonpoints) + 1;
                    });
                    users.forEach(user => {
                        if (seasonObj[user.firstname].rank == 1) {
                            rankingsTotal[user.firstname].firsts_emoji += 1;
                        } else if (seasonObj[user.firstname].rank == 2) {
                            rankingsTotal[user.firstname].seconds_emoji += 1;
                        } else if (seasonObj[user.firstname].rank == 3) {
                            rankingsTotal[user.firstname].thirds_emoji += 1;
                        }
                    })
                })
                users.forEach(user => {
                    rankingsTotal[user.firstname].totalmedals = rankingsTotal[user.firstname].firsts_emoji + rankingsTotal[user.firstname].seconds_emoji + rankingsTotal[user.firstname].thirds_emoji;
                })
                const result = Object.values(rankingsTotal);
                console.log(result)
                setRankings(result);
            } catch(error) {
                console.log('error', error);
            }
        }
        getRankings();
    }, []);

    rankings.forEach(row => {
        (row.sumpoints = parseInt(row.sumpoints));
        (row.firsts_emoji = parseInt(row.firsts_emoji));
        (row.seconds_emoji = parseInt(row.seconds_emoji));
        (row.thirds_emoji = parseInt(row.thirds_emoji));
        (row.totalmedals = parseInt(row.totalmedals));
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
            <Paper className={classes.paper} style={{maxWidth: 700}}>
                <TableContainer height="85%" classes={{ root: classes.tableContainer }}>
                    <Table className={classes.table} stickyHeader={true}>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {stableSort(rankings, getComparator(order, orderBy)).map(
                                row => {
                                    return (
                                        <TableRow hover key={row.firstname}>
                                            <TableCell  align="left" style={{display: "table-cell", paddingLeft: "10px", fontWeight: "bold"}} className={classes.firstCell}>{row.firstname}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.sumpoints}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.firsts_emoji}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.seconds_emoji}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.thirds_emoji}</TableCell>
                                            <TableCell  align="left" className={classes.cell_short}>{row.totalmedals}</TableCell>
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
