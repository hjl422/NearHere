import React from "react";
import ReactDOM from "react-dom";
import Moment from 'moment';
import firebase from 'firebase';
import {Layout, Drawer, Navigation} from "react-mdl";
import "../scss/jessica.scss";

export default class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };

        // Variables for storing firebase references
        this.messagesRef;
        this.convoRef;
    }
    
    // Firebase user login and setup
    componentWillMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // Get current user and call getConvoList
                firebase.database().ref("users/" + user.uid).once("value", (snapshot) => this.getUser(snapshot));
            } else {
                //browserHistory.goBack();
                this.context.router.push("/signin");
            }
        }.bind(this));
    }

    // Gets the current users data and calls an update to convo list
    getUser(snapshot){
        // Passed getConvoList as a callback so that user will be set by the time 
        // its called
        this.setState({
            user: {
                uid: snapshot.key,
                displayName: snapshot.val().displayName,
                photoURL: snapshot.val().photoURL
            }
        }, this.getConvoList());
        
    }

    // Get users conversations (updating when new ones are started)
    getConvoList(){
        this.convoRef = firebase.database().ref("conversations");
        this.convoRef.on("value", (snapshot) => this.updateConvoList(snapshot));
    }

    // gets the new convo list from firebase
    updateConvoList(snapshot){
        var convoList = [];
        snapshot.forEach(function(convo) {
            // Filter for conversations that I'm a part of
            if ((convo.val().memberlist.myID == this.state.user.uid) || (convo.val().memberlist.friendID == this.state.user.uid)) {
                convoList.push(convo);

                // If the convoID URL param is set
                if (this.props.params && this.props.params.convoID) {
                    // And is found in the convo list
                    if (this.props.params.convoID == convo.key) {
                        this.setCurrentConvo(convo.key);
                    }else{
                        //console.log("A conversation with that id doesn't exist");
                    }
                }
            }
        }.bind(this));
        this.setState({convoList: convoList});
    }

    // Sets the current convo to the one with the given key
    setCurrentConvo(convoKey){
        this.context.router.push("/messages/" + convoKey);
        this.messagesRef = firebase.database().ref("conversations/" + convoKey + "/messages");
        this.messagesRef.on("value", function(snapshot) {
            this.setState({messages: snapshot});
        }.bind(this));
    }

    // Remove database connections if component is unmounting
    componentWillUnmount() {
        if(this.messagesRef){
            this.messagesRef.off();
        }
        if(this.convoRef){
            this.convoRef.off();
        }
    }

    // Pushes current message to firebase
    createMessage(evt) {
        evt.preventDefault();

        var message = {
            content: this.state.content,
            createdOn: firebase.database.ServerValue.TIMESTAMP,
            createdBy: {
                uid: this.state.user.uid,
                displayName: this.state.user.displayName,
                photoURL: this.state.user.photoURL,
            }
        }
        this.messagesRef.push(message);

        this.setState({
            content: ""
        });
        return false;
    }

    // Hnadles changing of forms
    handleChange(evt) {
        this.setState({content: evt.target.value});
    }
 
    // The view
    render() {
        var messages = [];
        var conversations = [];
        var userPost;
        
        if (this.state.messages) {
            this.state.messages.forEach(function(message) {
                var messageValue = message.val();

                var userPost = "";
                if (messageValue.createdBy.uid == this.state.user.uid) {
                    userPost = "-user";
                }

                messages.push(
                    <div className={"messages" + userPost} key={message.key}>
                        <img src={messageValue.createdBy.photoURL} alt="User profile picture" className="profile-pic"/>
                        <div className="post-content">
                            <div className="message-title">
                                <p className="user-name">{messageValue.createdBy.displayName}</p>
                                <p className="time-stamp">{Moment(messageValue.createdOn).fromNow()}</p>
                            </div>
                            <i className="material-icons edit hidden">mode_edit</i>
                            <p className="message-content">{messageValue.content}</p>
                        </div>
                    </div>
                )
            }.bind(this));
        }

        if (this.state.convoList) {
            this.state.convoList.forEach(function(convo) { 
                var currentName = convo.val().memberlist.friendName;
                if(convo.val().memberlist.friendName == this.state.user.displayName){
                    currentName = convo.val().memberlist.myName;
                }
                conversations.push(
                    <li key={convo.key} onClick={() => this.setCurrentConvo(convo.key)}>{currentName}</li>
                )
            }.bind(this));
        }

        return (
            <Layout fixedDrawer className="d-cont">
                <Drawer title="Conversations">
                    <Navigation>
                        {conversations}
                    </Navigation>
                </Drawer>
                <div className="jb-container-msg">
                    <div className="jb-container-center">
                        <form className="new-message-form" onSubmit={evt => this.createMessage(evt)}>
                        <div className="mdl-textfield mdl-js-textfield">
                                <input id="message-input" type="text"
                                    className="mdl-textfield__input new-message"
                                    value={this.state.content}
                                    onChange={evt => this.handleChange(evt)}
                                    placeholder="What do you want to say?"
                                    required/>
                            </div>
                        </form>
                        <div id="messageList" className="message-list">{messages}</div> 
                    </div>
                </div>
            </Layout>
        );
    }
}

Messages.contextTypes = {
    router: React.PropTypes.object
};