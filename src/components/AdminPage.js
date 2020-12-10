import React from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "react-bootstrap/Button";

const Container = styled.div`
    display: flex;
    `;

export default class AdminPage extends React.Component {

    componentDidMount() {
        this.fetchLogistics();
    }

    async fetchLogistics() {
        let logistics = await this.LogisticsInfo();
        let users = await this.UserInfo();
        let contestants = await this.allContestants();
        let currentPicks = {};
        users.map(user => {currentPicks[user.firstname] = user.picks})

        this.setState({
            currentWeek: logistics[0].currentWeek,
            users: users,
            allCurrentPicks: currentPicks,
            logistics: logistics[0],
            contestants: contestants
        });
    }

    async LogisticsInfo() {
        return (await axios.get('https://finalrosefantasy.herokuapp.com/logistics')).data
    }

    async UserInfo() {
        return (await axios.get('https://finalrosefantasy.herokuapp.com/users')).data
    }

    async allContestants() {
        return (await axios.get('https://finalrosefantasy.herokuapp.com/contestants')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            currentWeek: "0",
            users: {},
            allCurrentPicks: {},
            finalContestants: {},
            logistics: {},
            contestants: [],
        }
    }

    pickTeamsWeek1 = () => {

        const week1pickorder = [
            ['Erik', 'Rachel', 'Rebecca', 'Julia', 'Kendall', 'Davis', 'Hope', 'Shannon'],
            ['Julia', 'Kendall', 'Davis', 'Hope', 'Shannon', 'Erik', 'Rachel', 'Rebecca'],
            ['Shannon', 'Rebecca', 'Hope', 'Rachel', 'Davis', 'Kendall', 'Erik', 'Julia']
        ]

        let Preferences = this.state.allCurrentPicks;
        let FinalPicks =  {}
        this.state.users.map(user => {FinalPicks[user.firstname] = []})
        if (!(Preferences === {})) {
            let ContestantTimesPicked = {};
            for (let roundnum = 0; roundnum < week1pickorder.length; roundnum++) {
                let roundorder = week1pickorder[roundnum];
                roundorder.forEach(friend => {
                    let n = 0;
                    let friendPicks = Preferences[friend];
                    if (!(friendPicks === undefined)) {
                        while (n < 10) {
                            let idealcontestant = friendPicks[(roundnum + n)];
                            if (!(FinalPicks[friend].includes(idealcontestant))) {
                                if (ContestantTimesPicked[idealcontestant] === undefined) {
                                    ContestantTimesPicked[idealcontestant] = 1;
                                    FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                    break;
                                } else {
                                    let ContestantUsedNum = (ContestantTimesPicked[idealcontestant] + 1)
                                    if (ContestantUsedNum <= 3) {
                                        ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                        FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                        break;
                                    }
                                }
                            }
                            n += 1
                        }
                    }
                });
            }
        }
        return(FinalPicks)
    }

    lastWeekContestantTimesPicked = value => {
        let users = this.state.users
        let lastWeekTeamColumnName = "week" + (parseInt(value) - 1) + "team";
        let ContestantTimesPicked = {};

        (users).forEach(user => {
            let lastWeekTeam = user[lastWeekTeamColumnName];
            lastWeekTeam.forEach(contestant => {
                if (ContestantTimesPicked[contestant] === undefined) {
                    ContestantTimesPicked[contestant] = 1;
                } else {
                    let ContestantUsedNum = (ContestantTimesPicked[contestant] + 1)
                    ContestantTimesPicked[contestant] = ContestantUsedNum;
                }
            })
        })
        return ContestantTimesPicked
    }

    pickTeamsWeek = value => {
        this.setCurrentWeek(value);
        let Preferences = this.state.allCurrentPicks;
        let users = this.state.users.sort((a, b) => (parseInt(a.totalpoints) > parseInt(b.totalpoints)) ? 1 : -1);

        let FinalPicks = {}
        users.map(user => {
            FinalPicks[user.firstname] = []
        })

        /*
        let lastWeekTeams =  {}
        users.map(user => {lastWeekTeams[user.firstname] = []})
         */
        let lastWeekTeamColumnName = "week" + (parseInt(value) - 1) + "team";
        let ContestantTimesPicked = this.lastWeekContestantTimesPicked(value);

        (users).forEach(user => {
            let lastWeekTeam = user[lastWeekTeamColumnName];
            let friend = user.firstname;
            let lastWeekRemaining = (lastWeekTeam
                .map(contestantLink => this.state.contestants.find(contestant => contestant.nameLink === contestantLink))
                .filter(contestant => contestant.status === "on"))
            FinalPicks[friend] = lastWeekRemaining.map(contestant => contestant.nameLink);

            let friendPicks = Preferences[friend]
                .map(contestantLink => this.state.contestants.find(contestant => contestant.nameLink === contestantLink))
                .filter(contestant => contestant.status === "on")
                .map(contestant => contestant.nameLink);

            if (FinalPicks[friend].length < lastWeekTeam.length) {
                if (!(friendPicks === undefined)) {
                    for (let i = FinalPicks[friend].length; i < lastWeekTeam.length; i++) {
                        let n = 0;
                        while (n < 10) {
                            let idealcontestant = friendPicks[n];
                            if (!(FinalPicks[friend].includes(idealcontestant))) {
                                if (ContestantTimesPicked[idealcontestant] === undefined) {
                                    ContestantTimesPicked[idealcontestant] = 1;
                                    FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                    break;
                                } else {
                                    let ContestantUsedNum = (ContestantTimesPicked[idealcontestant] + 1)
                                    if (ContestantUsedNum <= 3) {
                                        ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                        FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                        break;
                                    }
                                }
                            }
                            n += 1
                        }
                    }
                }
            }
        })
        return FinalPicks
    }

    setTeamsWeek = value => {
        let weekTeam = "week" + value + "team";
        let FinalPicks = {};
        let users = this.state.users;

        if (value === "1") {
            FinalPicks = this.pickTeamsWeek1();
        } else {
            FinalPicks = this.pickTeamsWeek(value);
        }

        (users).forEach(user => {
            const updatedUser = {
                ...user,
                [weekTeam]: FinalPicks[user.firstname],
            };

            axios.put(('https://finalrosefantasy.herokuapp.com/updateuser/' + user._id), {
                updatedUser
            })
                .then(res => console.log(res.data))
        });

    }

    getSetEliminatedWeek = value => {
        let weekActionsColumnName = "week" + value + "actions";
        let eliminatedLinks = [];
        let updatedLogistics = this.state.logistics;

        (this.state.contestants).forEach(contestant => {
            let weekActions = (contestant[weekActionsColumnName]).map(action => action.key)
            if (weekActions.includes("Does not advance / Eliminated") || weekActions.includes("Contestant leaves (no point penalty)")) {
                eliminatedLinks.push(contestant.nameLink);
                const updatedContestant = {
                    ...contestant,
                    'status': 'eliminated',
                };
                axios.put(('https://finalrosefantasy.herokuapp.com/updatecontestant/'+updatedContestant.nameLink), {
                    updatedContestant
                })
                const contestantIndex = this.state.contestants.indexOf(this.state.contestants.find(originalContestant => originalContestant.nameLink === updatedContestant.nameLink));
                const newState = {
                    ...this.state.contestants,
                    [contestantIndex]: updatedContestant,
                }
                this.setState(newState);
            }
        })

        let updateAllEliminated = (updatedLogistics.alleliminated).concat(eliminatedLinks)
        updatedLogistics.alleliminated = [...new Set(updateAllEliminated)];

        for (let i=(parseInt(value)+1); i<=10; i++) {
            let weekEliminatedColumnName = "week" + (i).toString() + "eliminated";
            let updatedEliminated = (updatedLogistics[weekEliminatedColumnName]).concat(eliminatedLinks)
            updatedLogistics[weekEliminatedColumnName] = [...new Set(updatedEliminated)];
        }

        axios.put(('https://finalrosefantasy.herokuapp.com/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))

        this.setState({'logistics': updatedLogistics})
    }

    getPointsWeek = value => {

        this.getSetEliminatedWeek(value);

        let weekTeamColumnName = "week" + value + "team";
        let weekPointsColumnName = "week" + value + "points";
        let weekTotalColumnName = "week" + value + "total";

        let users = this.state.users;

        (users).forEach(user => {
            let weekTeam = user[weekTeamColumnName];
            let weekTotal = 0;

            weekTeam.forEach(contestantLink => {
                let contestant = this.state.contestants.find(contestant => contestant.nameLink === contestantLink);
                weekTotal += parseInt(contestant[weekPointsColumnName]);
            })

            let totalTotal = (parseInt(user.week1total) + parseInt(user.week2total) + parseInt(user.week3total) + parseInt(user.week4total) + parseInt(user.week5total) + parseInt(user.week6total) + parseInt(user.week7total) + parseInt(user.week8total) + parseInt(user.week9total) + parseInt(user.week10total) + parseInt(user.week11total) + parseInt(user.week12total) + weekTotal).toString()
            console.log(totalTotal)

            const updatedUser = {
                ...user,
                'totalpoints': totalTotal,
                [weekTotalColumnName]: weekTotal.toString()
            };
            console.log((totalTotal + weekTotal));
            console.log(updatedUser)
            axios.put(('https://finalrosefantasy.herokuapp.com/updateuser/' + user._id), {updatedUser})
                .then(res => console.log(res.data))
        });
    }

    setCurrentWeek = value => {
        let currentWeek = value;
        let currentLogistics = this.state.logistics;

        const updatedLogistics = {
            ...currentLogistics,
            'currentWeek': currentWeek,
        };

        axios.put(('https://finalrosefantasy.herokuapp.com/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))
        this.setState({'logistics': updatedLogistics, currentWeek: updatedLogistics.currentWeek})
    };

    setScoreWeek = value => {
        let currentWeek = value;
        let currentLogistics = this.state.logistics;

        const updatedLogistics = {
            ...currentLogistics,
            'currentWeek': currentWeek,
        };

        axios.put(('https://finalrosefantasy.herokuapp.com/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))
        this.setState({'logistics': updatedLogistics, currentWeek: updatedLogistics.currentWeek})

        this.props.history.push('/scoreform')
    };

    dropTo2Contestants = () => {
        let value = this.state.currentWeek;
        let Preferences = this.state.allCurrentPicks;
        let users = this.state.users.sort((a, b) => (parseInt(a.totalpoints) > parseInt(b.totalpoints)) ? 1 : -1);

        let FinalPicks = {}
        users.map(user => {
            FinalPicks[user.firstname] = []
        })

        let lastWeekTeamColumnName = "week" + (parseInt(value) - 1) + "team";
        let ContestantTimesPicked = this.lastWeekContestantTimesPicked(value);

        (users).forEach(user => {
            let lastWeekTeam = user[lastWeekTeamColumnName];
            let friend = user.firstname;
            let lastWeekRemaining = (lastWeekTeam
                .map(contestantLink => this.state.contestants.find(contestant => contestant.nameLink === contestantLink))
                .filter(contestant => contestant.status === "on"))
            // FinalPicks[friend] = lastWeekRemaining.map(contestant => contestant.nameLink);
            let lastWeekRemainingNames = lastWeekRemaining.map(contestant => contestant.nameLink);

            let friendPicks = Preferences[friend]
                .map(contestantLink => this.state.contestants.find(contestant => contestant.nameLink === contestantLink))
                .filter(contestant => contestant.status === "on")
                .map(contestant => contestant.nameLink);


            console.log(user.firstname + ' Picks: ' + friendPicks)
            console.log(user.firstname + ' Last Week Team: ' + lastWeekRemainingNames)
            FinalPicks[friend] = [];
            if (!(friendPicks === undefined)) {
                while (FinalPicks[friend].length < 2) {
                    let n = 0;
                    while (n < 10) {
                        let idealcontestant = friendPicks[n];
                        if (!(idealcontestant === undefined)) {
                            if (!(FinalPicks[friend].includes(idealcontestant))) {
                                if (lastWeekRemainingNames.includes(idealcontestant)) {
                                    console.log(idealcontestant)
                                    FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                    break;
                                }
                            }
                        }
                        n += 1;
                    }
                }
            }
            for (let i = 0; i < 3; i++) {
                let contestant = lastWeekRemainingNames[i];
                if (!(FinalPicks[friend].includes(contestant))) {
                    console.log('bumped contestant: ' + contestant)
                    let ContestantUsedNum = (ContestantTimesPicked[contestant] - 1)
                    ContestantTimesPicked[contestant] = ContestantUsedNum;
                }
            }

            if (FinalPicks[friend].length < 2) {
                if (!(friendPicks === undefined)) {
                    for (let i = FinalPicks[friend].length; i < 2; i++) {
                        let n = 0;
                        while (n < 10) {
                            let idealcontestant = friendPicks[n];
                            if (!(FinalPicks[friend].includes(idealcontestant))) {
                                if (ContestantTimesPicked[idealcontestant] === undefined) {
                                    ContestantTimesPicked[idealcontestant] = 1;
                                    FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                    break;
                                } else {
                                    let ContestantUsedNum = (ContestantTimesPicked[idealcontestant] + 1)
                                    if (ContestantUsedNum <= 3) {
                                        ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                        FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                        break;
                                    }
                                }
                            }
                            n += 1
                        }
                    }
                }
            }

            console.log(ContestantTimesPicked)
            console.log(user.firstname + ' FinalPicksFriendEnd ' + FinalPicks[friend])

        })

        let weekTeam = "week" + value + "team";
        (users).forEach(user => {
            const updatedUser = {
                ...user,
                [weekTeam]: FinalPicks[user.firstname],
            };

            axios.put(('https://finalrosefantasy.herokuapp.com/updateuser/' + user._id), {
                updatedUser
            })
                .then(res => console.log(res.data))
        });
    }

    render() {
        let weekOptions = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        return (
            <div style={{margin: "8px", display: "inline-flex", flexDirection: "column", alignItems: 'center',
                justifyContent: 'center', justifyItems: "center"}}>
                <br />
                <h3>Current Week: {this.state.currentWeek}</h3>
                <br />
                <Button variant="warning" style={{width: "180px"}} onClick={this.createContestantLink}>
                    Create Contestant
                </Button>
                {weekOptions.map((week, index) => {
                    return (
                        <Container key={"WeekContainer" + week}>
                            <Button variant="primary" style={{margin: "4px", width: "110px"}} value={week} key={("SetCurrentWeek"+week)} onClick={e => this.setCurrentWeek(e.target.value)}>Set As Week {week}</Button>
                            <Button variant="danger" style={{margin: "4px", width: "110px"}} value={week} key={("SetTeamsWeek"+week)} onClick={e => this.setTeamsWeek(e.target.value)}>Set Week {week} Picks</Button>
                            <Button variant="secondary" style={{margin: "4px", width: "110px"}} value={week} key={("GetScore"+week)} onClick={e => this.setScoreWeek(e.target.value)}>Score Contestants Week {week}</Button>
                            <Button variant="success" style={{margin: "4px", width: "110px"}} value={week} key={("GetPoints"+week)} onClick={e => this.getPointsWeek(e.target.value)}>Get Week {week} Points</Button>
                        </Container>
                    )
                })}
                <Container key="drop">
                    <Button variant="warning" style={{width: "180px", margin: "4px"}} onClick={this.dropTo2Contestants}>
                        Drop To Teams of 2
                    </Button>
                    <Button variant="warning" style={{width: "180px", margin: "4px"}} onClick={this.deleteContestantLink}>
                        Drop To Teams of 1
                    </Button>
                </Container>
            </div>
        )
    }
}