/**
 * This file contains example implementations of some of the react and router 
 * concepts we are using on this project
 * 
 * This file will be removed before turn in
 * 
 * Concepts shown
 * - Firebase setup
 * - Programmatic routing
 * - URL Parameters
 */

/**
 * URL Params Docs: https://github.com/reactjs/react-router-tutorial/tree/master/lessons/06-params
 * Progamatic Nav Docs: https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating
 * Firebase Docs: https://firebase.google.com/docs/reference/js/
 */

/**
 * Examples in progress
 */

import React from "react";
import firebase from 'firebase';

export default class Example extends React.Component{
    constructor(props){
        super(props);

        this.firebaseRef;
    }

    componentWillMount(){
        this.firebaseSetup();
    }

    firebaseSetup(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("logged in");
                this.state = {user: user};
                
                this.firebaseRef = firebase.database().ref();
                this.firebaseRef.on("value", function(snapshot){
                    console.log(snapshot.val());
                });
            }else{
                console.log("not logged in");
                // Should be directed to the sign-in page
                // this.context.router.push("/signin");
            }
        });
    }

    render(){
        return(
            <div>
                Example
            </div>
        );
    }
}

/*
Example.contextType = {
  router: React.ProTypes.object
};
*/


/**
 * Implementation Ideas
 * 
 * Profile Page
 * - If url paramter /profile/:userid is set then load data from that users section of database
 * - Else the url will be /profile, load currently logged in users data
 * 
 * Profile Message Button
 * - Only apprear if the page isn't the current users
 * - When clicked load all conversations from firebase and check if there is a conversations
 * between the current user and the owner of the page they are on. IF there is one then
 * programmatically link the user to that conversation. IF there isn't one, create it and then 
 * programatically link the user to it.
 * 
 * Conversation Page
 * - By default the path /messages will display all of the conversations that the current user
 * is a part of
 * - If the url paramater /messages/:messageid is declared then show that specific thread instead 
 */