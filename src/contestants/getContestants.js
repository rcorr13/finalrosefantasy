import axios from "axios";

export default function getContestants() {
    let contestants = [];
    axios.get('http://localhost:5000/contestants')
        .then(response => {
            contestants = response.data;
        })
        .catch(function (error){
            console.log(error);
        })
    console.log(contestants);
    return contestants
}