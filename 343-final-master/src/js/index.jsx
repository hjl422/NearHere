import React from "react";
import {render} from "react-dom";

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import App from "./app.jsx";
import Profile from "./profile.jsx";
import Feed from "./feed.jsx";
import Messages from "./messages.jsx";
import Auth from "./auth.jsx";
import SignIn from "./signin.jsx";
import SignUp from "./signup.jsx";
import "../scss/main.scss";

import {Router, Route, IndexRoute, hashHistory} from "react-router";

// Initialize Firebase
import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyBf_YrMkg7wldc9cxzkbqnpY3np5K7zYPg",
    authDomain: "i343-final.firebaseapp.com",
    databaseURL: "https://i343-final.firebaseio.com",
    storageBucket: "i343-final.appspot.com",
    messagingSenderId: "187156224155"
};
firebase.initializeApp(config);

var coords = {
    lat: 0,
    long: 0
};

var router = (
    <Router history={hashHistory}>
        <Route path="/signin" component={Auth}>
            <IndexRoute component={SignIn}></IndexRoute>
            <Route path="/signup" component={SignUp}></Route>
        </Route> 
        <Route path="/" component={App}>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/profile/:userID" component={Profile}></Route>
            <IndexRoute component={Feed} coords={coords}></IndexRoute>
            <Route path="/messages" component={Messages}></Route>
            <Route path="/messages/:convoID" component={Messages}></Route>
        </Route> 
    </Router>
);

render(router, document.getElementById("app"));