import React from "react";
import axios from "axios";
import styled from "styled-components";
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
        return (await axios.get('http://localhost:5000/logistics')).data
    }

    async UserInfo() {
        return (await axios.get('http://localhost:5000/users')).data
    }

    async allContestants() {
        return (await axios.get('http://localhost:5000/contestants')).data
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
            ['Shannon','Erik', 'Rachel'],
            ['Shannon','Rachel', 'Erik'],
            ['Shannon','Erik','Rachel']]
        /*
        const week1pickorder = [
            ['Erik', 'Rachel', 'Rebecca', 'Julia', 'Kendall', 'Davis', 'Hope', 'Shannon'],
            ['Julia', 'Kendall', 'Davis', 'Hope', 'Shannon', 'Erik', 'Rachel', 'Rebecca'],
            ['Shannon', 'Rebecca', 'Hope', 'Rachel', 'Davis', 'Kendall', 'Erik', 'Julia']
        ]
         */
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

            axios.put(('http://localhost:5000/updateuser/' + user._id), {
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
                axios.put(('http://localhost:5000/updatecontestant/'+updatedContestant.nameLink), {
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

        axios.put(('http://localhost:5000/updatelogistics'), {
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
            let totalTotal = parseInt(user.totalpoints);
            console.log(totalTotal)
            let weekTotal = 0;

            weekTeam.forEach(contestantLink => {
                let contestant = this.state.contestants.find(contestant => contestant.nameLink === contestantLink);
                weekTotal += parseInt(contestant[weekPointsColumnName]);
            })

            const updatedUser = {
                ...user,
                'totalpoints': (parseInt(user.totalpoints) + weekTotal).toString(),
                [weekTotalColumnName]: weekTotal.toString(),
            };
            console.log((totalTotal + weekTotal));
            console.log(updatedUser)
            axios.put(('http://localhost:5000/updateuser/' + user._id), {updatedUser})
                .then(res => console.log(res.data))
        });
        //window.location.href = "/standings";
    }

    setCurrentWeek = value => {
        let currentWeek = value;
        let currentLogistics = this.state.logistics;

        const updatedLogistics = {
            ...currentLogistics,
            'currentWeek': currentWeek,
        };

        axios.put(('http://localhost:5000/updatelogistics'), {
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

        axios.put(('http://localhost:5000/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))
        this.setState({'logistics': updatedLogistics, currentWeek: updatedLogistics.currentWeek})

        window.location.href = "/scoreform";
    };

    render() {
        let weekOptions = ['1','2','3','4','5','6','7','8','9','10'];
        return (
            <div>
                <h3>Current Week: {this.state.currentWeek}</h3>
                {weekOptions.map((week, index) => {
                    return (
                        <Container>
                            <button value={week} onClick={e => this.setTeamsWeek(e.target.value)}>Set Week {week} Picks</button>
                            <button value={week} onClick={e => this.setScoreWeek(e.target.value)}>Score Contestants Week {week}</button>
                            <button value={week} onClick={e => this.getPointsWeek(e.target.value)}>Get Week {week} Points</button>
                        </Container>
                    )
                })}
            </div>
        )
    }
}