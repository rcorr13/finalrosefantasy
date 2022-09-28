import React from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import GetBaseURL from "./GetBaseURL";

const Container = styled.div`
    display: flex;
    `;



export default class AdminPage extends React.Component {
    componentDidMount() {
        this.fetchLogistics();
    }

    async fetchLogistics() {
        let master = await this.MasterInfo();
        let currentWeek = master[0].currentWeek;
        let currentSeason = master[0].currentSeason;
        let logistics = await this.LogisticsInfo();
        logistics = logistics.filter(option => option.season === currentSeason)[0];
        let users = await this.UserInfo();
        let contestants = await this.allContestants();
        let currentPicks = {};
        users.map(user => {currentPicks[user.firstname] = user.picks});

        this.setState({
            currentWeek: currentWeek,
            currentSeason: currentSeason,
            users: users,
            allCurrentPicks: currentPicks,
            logistics: logistics,
            contestants: contestants,
        });
    }

    async LogisticsInfo() {
        let logistics = (await axios.get(GetBaseURL() + '/logistics'))
        return logistics.data
    }

    async MasterInfo() {
        return (await axios.get(GetBaseURL() + '/masters')).data
    }

    async UserInfo() {
        let users = (await axios.get(GetBaseURL() + '/users/' + this.state.currentSeason))
        return users.data
    }

    async allContestants() {
        return (await axios.get(GetBaseURL() + '/contestants')).data
    }

    constructor(props) {
        super(props);
        this.state = {
            currentWeek: "1",
            currentSeason: "BiP-8",
            users: {},
            allCurrentPicks: {},
            finalContestants: {},
            logistics: {},
            contestants: [],
            baseURL: GetBaseURL(),
        }
    }

    // from https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
    isArrayContentSame(a, b) {
        if (Array.isArray(a) && Array.isArray(b) && a.length == b.length) {
            a = a.concat().sort()
            b = b.concat().sort()
            return a.reduce((acc,e,i) => acc && e === b[i], true)
        } else {
            return false;
        }
    }

    pickTeamsWeek1 = () => {

        /*
        const week1pickorder = [
            ['Shannon', 'Rebecca', 'Julia', 'Rachel', 'Erik', 'Hope', 'Davis'],	
            ['Rachel', 'Erik', 'Hope', 'Davis', 'Shannon', 'Rebecca', 'Julia'],	
            ['Davis', 'Julia', 'Hope', 'Rebecca', 'Erik', 'Shannon', 'Rachel']
        ]
        
        const week1pickorder = [
            ['7', '6', '5', '4', '3', '2', '1'],	
            ['4', '3', '2', '1', '7', '6', '5'],	
            ['1', '5', '2', '6', '3', '7', '4']
        ]


        const week1pickorder = [
            ['Erik', 'Hope', 'Rachel', 'Shannon', 'Davis', 'Julia', 'Rebecca'],
            ['Rebecca', 'Julia', 'Davis', 'Shannon', 'Rachel', 'Hope', 'Erik'],
        ]

        */
        
        const week1pickorder = [
            ['Sarah', 'Julia', 'Rebecca', 'Rachel', 'Erik', 'Davis', 'Hope'],
            ['Rachel', 'Erik', 'Davis', 'Hope', 'Sarah', 'Julia', 'Rebecca'],
            ['Hope', 'Rebecca', 'Davis', 'Julia', 'Erik', 'Sarah', 'Rachel']
        ]
        

        let Preferences = this.state.allCurrentPicks;
        let FinalPicks =  {};
        let firstNames = Object.keys(Preferences);
        firstNames.map(firstname => {FinalPicks[firstname] = []})
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
                                    FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                    if (roundnum === (week1pickorder.length-1)) {
                                        for (let i = 0; i < firstNames.length; i++) {
                                            let friendName = firstNames[i]
                                            if (friend != friendName && (this.isArrayContentSame(FinalPicks[friend], FinalPicks[friendName])) && (FinalPicks[friend].length === week1pickorder.length)) {
                                                console.log('popped ' + friend + ' same as ' + friendName)
                                                FinalPicks[friend].pop()
                                            }
                                        }
                                        if (FinalPicks[friend].length === week1pickorder.length) {
                                            ContestantTimesPicked[idealcontestant] = 1;
                                            break
                                        }
                                    } else {
                                        ContestantTimesPicked[idealcontestant] = 1;
                                        break;
                                    }
                                } else {
                                    let ContestantUsedNum = (ContestantTimesPicked[idealcontestant] + 1)
                                    if (ContestantUsedNum <= 3) {
                                        FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                        if (roundnum === (week1pickorder.length-1)) {
                                            for (let i = 0; i < firstNames.length; i++) {
                                                let friendName = firstNames[i]
                                                if (friend != friendName && (this.isArrayContentSame(FinalPicks[friend], FinalPicks[friendName])) && (FinalPicks[friend].length === week1pickorder.length)) {
                                                    console.log('popped ' + friend + ' same as ' + friendName)
                                                    FinalPicks[friend].pop()
                                                }
                                            }
                                            if (FinalPicks[friend].length === week1pickorder.length) {
                                                ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                                break
                                            }
                                        } else {
                                            ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                            break;
                                        }
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

        let lastWeekTeamColumnName = "week" + (parseInt(value) - 1) + "team";
        let ContestantTimesPicked = this.lastWeekContestantTimesPicked(value);

        (users).forEach(user => {
            let lastWeekTeam = user[lastWeekTeamColumnName];
            let friend = user.firstname;
            let lastWeekRemaining = (lastWeekTeam
                .map(contestantLink => this.state.contestants.find(contestant => contestant.nameLink === contestantLink))
                .filter(contestant => contestant.status === "on"))
            FinalPicks[friend] = lastWeekRemaining.map(contestant => contestant.nameLink);
        })
        console.log(FinalPicks);

        (users).forEach(user => {
            let lastWeekTeam = user[lastWeekTeamColumnName];
            console.log(lastWeekTeam)
            let friend = user.firstname;
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
                                        FinalPicks[friend] = FinalPicks[friend].concat([idealcontestant]);
                                        (users).forEach(user => {
                                            let friendName = user.firstname;
                                            if (friend != friendName && (this.isArrayContentSame(FinalPicks[friend], FinalPicks[friendName])) && (FinalPicks[friend].length === lastWeekTeam.length)) {
                                                console.log('popped ' + friend + ' same as ' + friendName);
                                                FinalPicks[friend].pop()
                                            }
                                        })
                                        if (FinalPicks[friend].length === lastWeekTeam.length) {
                                            ContestantTimesPicked[idealcontestant] = ContestantUsedNum;
                                            break
                                        }
                                    } else {
                                        console.log('Contestant ' + idealcontestant + ' on too many teams - skipping');
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

    dropto2contestants = () => {
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

            if (lastWeekRemainingNames.length == 3) {
                console.log('length 3')
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
            }

            console.log(ContestantTimesPicked)
            console.log(user.firstname + ' FinalPicksFriendEnd ' + FinalPicks[friend])

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

            axios.put((GetBaseURL() + '/updateuser/' + this.state.currentSeason + "/" + user.id), {
                updatedUser
            })
                .then(res => console.log(res.data))
        });

    }

    getSetEliminatedWeek = value => {
        let weekActionsColumnName = "week" + value + "actions";
        let eliminatedLinks = [];
        let updatedLogistics = this.state.logistics;
        console.log(this.state.contestants);
        (this.state.contestants).forEach(contestant => {
            let weekActions = (contestant[weekActionsColumnName]).map(action => action.key);
            console.log(weekActions);
            if (weekActions.includes("Does not advance / Eliminated") || weekActions.includes("Leaves for extenuating circumstances (no point penalty)") || weekActions.includes("Leaves of their own accord/not sent home by the 
            or (unless for emergency reasons)") || weekActions.includes("Production staff sends contestant home")) {
                eliminatedLinks.push(contestant.nameLink);
                const updatedContestant = {
                    ...contestant,
                    'status': 'eliminated',
                };
                axios.put((GetBaseURL() + '/updatecontestant/'+updatedContestant.nameLink), {
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

        console.log(updatedLogistics)
        console.log(eliminatedLinks)
        let updateAllEliminated = [];

        if (eliminatedLinks.length > 0) {
            updateAllEliminated = (updatedLogistics.alleliminated).concat(eliminatedLinks);
            updatedLogistics.alleliminated = [...new Set(updateAllEliminated)];
            for (let i=(parseInt(value)+1); i<=10; i++) {
                let weekEliminatedColumnName = "week" + (i).toString() + "eliminated";
                let updatedEliminated = (updatedLogistics[weekEliminatedColumnName]).concat(eliminatedLinks)
                updatedLogistics[weekEliminatedColumnName] = [...new Set(updatedEliminated)];
            }
        }


        console.log(updatedLogistics)
        axios.put((GetBaseURL() + '/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))

        this.setState({'logistics': updatedLogistics})
    }

    getPointsWeek = value => {

        this.getSetEliminatedWeek(value);

        let weekTeamColumnName = "week" + value + "team";
        let weekPointsColumnName = "week" + value + "points";
        let weekTotalColumnName = "week" + value + "total";

        let users = this.state.users;
        console.log(users);

        (users).forEach(user => {
            let weekTeam = user[weekTeamColumnName];
            let weekTotal = 0;

            weekTeam.forEach(contestantLink => {
                let contestant = this.state.contestants.find(contestant => contestant.nameLink === contestantLink);
                weekTotal += parseInt(contestant[weekPointsColumnName]);
            })

            let totalTotal = (parseInt(user.week1total) + parseInt(user.week2total) + parseInt(user.week3total) + parseInt(user.week4total) + parseInt(user.week5total) + parseInt(user.week6total) + parseInt(user.week7total) + parseInt(user.week8total) + parseInt(user.week9total) + parseInt(user.week10total) + parseInt(user.week11total) + parseInt(user.week12total) + weekTotal).toString()

            const updatedUser = {
                ...user,
                'totalpoints': totalTotal,
                [weekTotalColumnName]: weekTotal.toString()
            };

            console.log(updatedUser)
            axios.put((GetBaseURL() + '/updateuser/' + this.state.currentSeason + "/" + user.id), {updatedUser})
                .then(res => console.log(res.data))
        });
    }

    setCurrentWeek = value => {
        const updatedMaster = {
            'currentSeason': this.state.currentSeason,
            'currentWeek': value,
        };

        axios.put((GetBaseURL() + '/updatemaster'), {
            updatedMaster}).then(res => console.log(res.data))
        this.setState({currentWeek: value})
    };

    setScoreWeek = value => {
        let currentWeek = value;
        let currentLogistics = this.state.logistics;

        const updatedLogistics = {
            ...currentLogistics,
            'currentWeek': currentWeek,
        };

        axios.put((GetBaseURL() + '/updatelogistics'), {
            updatedLogistics}).then(res => console.log(res.data))
        this.setState({'logistics': updatedLogistics, currentWeek: updatedLogistics.currentWeek})

        this.props.history.push('/scoreform')
    };

    createContestantLink=()=> {
        this.props.history.push('/createcontestant')
    }

    deleteContestantLink = () => {
        this.props.history.push('/deletecontestant')
    }

    seeCurrentPicks = ()=> {
        this.props.history.push("/picks/"+this.state.currentSeason+"/"+this.state.currentWeek)
    }

    render() {
        let weekOptions = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        return (
            <div style={{margin: "8px", display: "inline-flex", flexDirection: "column", alignItems: 'center',
                justifyContent: 'center', justifyItems: "center"}}>
                <br />
                <h3>Current Week: {this.state.currentWeek}</h3>
                <br />
                <Container key="createdelete">
                    <Button variant="warning" style={{width: "120px", margin: "4px"}} onClick={this.createContestantLink}>
                        Create Contestant
                    </Button>
                    <Button variant="warning" style={{width: "120px", margin: "4px"}} onClick={this.deleteContestantLink}>
                        Delete Contestant
                    </Button>
                    <Button variant="warning" style={{width: "120px", margin: "4px"}} onClick={this.seeCurrentPicks}>
                        Current Picks
                    </Button>
                </Container>
                {weekOptions.map(week => {
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
                    <Button variant="warning" style={{width: "180px", margin: "4px"}} onClick={this.dropto2contestants}>
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
