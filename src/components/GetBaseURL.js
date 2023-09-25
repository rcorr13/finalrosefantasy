import React from "react";

export default function (GetBaseURL) {

    let usingHeroku = true;
    let baseURL = 'https://finalrosefantasy.herokuapp.com';

    if (!usingHeroku) {
        baseURL = 'http://localhost:5000';
    }
    return baseURL
}
