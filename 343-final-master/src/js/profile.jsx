import React from "react";
import ReactDom from "react-dom";
import {Link} from "react-router";
import firebase from 'firebase';
import "../scss/jenny.scss";
import {Button} from "react-mdl";
import md5 from "js-md5";

/*
 * Profile Message Button
 * - Only apprear if the page isn't the current users
 * - When clicked load all conversations from firebase and check if there is a conversations
 * between the current user and the owner of the page they are on. IF there is one then
 * programmatically link the user to that conversation. IF there isn't one, create it and then 
 * programatically link the user to it.
 * 
 */
export default class Profile extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            db : firebase,
            user: "",
            profileUserID: "",
            isEditing: false,
            displayName: "",
            photoURL: "",
        };

        this.userRef;
    }

    componentWillMount(){
        this.firebaseSetup();
    }

    firebaseSetup(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var profileUser = user.uid;
                if(this.props.params.userID){ // If we are on someone elses profile page
                    profileUser = this.props.params.userID;
                }
                this.setState({
                    user: user,
                    profileUserID: profileUser
                });
                
                // Get the users data
                this.userRef = firebase.database().ref("users/" + profileUser);
                this.userRef.on("value", function(snapshot){
                    this.setState({
                        displayName: snapshot.val().displayName,
                        photoURL: snapshot.val().photoURL,
                        value: {
                            location: snapshot.val().location|| "City, State",
                            interestTitle1: snapshot.val().interestTitle1 || "Bio:",
                            interestTitle2: snapshot.val().interestTitle2 || "Age:",
                            interestTitle3: snapshot.val().interestTitle3 || "Occupation:",
                            interest1: snapshot.val().interest1 || "Insert Bio",
                            interest2: snapshot.val().interest2 || "Insert Age",
                            interest3: snapshot.val().interest3 || "Insert Occupation"
                        }
                    });
                }.bind(this));
            }else{
                console.log("not logged in"); 
                this.context.router.push("/signin");
            }
        });
    }

    // Checks if a convo exists between you and the profile you are on, makes one if
    // there isnt one. And sends you to that convo.
    findConvos() {
        firebase.database().ref("conversations").once("value", function(snapshot) {
            var found = false;
            var key;

            snapshot.forEach(function(snap) {
                key = snap.key;
                snap = snap.val();
                if((snap.memberlist.myID == this.state.user.uid &&
                   snap.memberlist.friendID == this.props.params.userID) || 
                   (snap.memberlist.myID == this.props.params.userID &&
                   snap.memberlist.friendID == this.state.user.uid)) {
                       if(found == false) {
                            console.log("Found match");
                            found = true;
                       }
                   }
            }.bind(this));

            if(!found) {
                console.log("No match found, creating new convo");
                this.makeConvo();
            } else {
                this.context.router.push("/messages/" + key);
            }

        }.bind(this));

        
    }

    // Makes a new convo between you and the profile you are currently on
    makeConvo() {
        firebase.database().ref("users/"+this.state.user.uid).once("value", function(snapshot){
            var currentName = snapshot.val().displayName;
            var convoID = firebase.database().ref("conversations").push({
                memberlist : {
                    friendID: this.props.params.userID,
                    friendName: this.state.displayName,
                    myID: this.state.user.uid,
                    myName: currentName
                },
                messages : {

                }
            });
            this.context.router.push("/messages/" + convoID.key);
        }.bind(this));

        
    }

    // Hnadles changes in the forms
    handleChange(evt, key){
        this.state.value[key] = evt.target.value;
        this.forceUpdate();
    }

    // Placeholder for proper validation
    validateInputs(){
        return true;
    }

    // Toggles between editing of profile and submitting data
    editUserProfile() {
        if(this.state.isEditing){
            // push new data to firebase
            this.sendUserProfile();

            this.setState({
                isEditing: false
            });
        }else{
            this.setState({
                isEditing: true
            });
        }
    }

    // Submits users edited data to firebase
    sendUserProfile(){
        var userData = this.state.value;
        this.userRef.update(userData);
    }

    // Removes firebase connection
    componentWillUnmount() {
        if(this.userRef){
            this.userRef.off();
        }
    }

    render() {
        var userProfile;
        var profileContent;
        var editButton;
        var editArea;
        var chitChat;

        if(this.state.user){
            if(!this.props.params.userID || (this.state.user.uid == this.props.params.userID)){
                var editButtonText = "Edit Profile";
                if(this.state.isEditing){
                    editButtonText = "Submit Edits";
                }
                editButton = (
                    <Button onClick={() => this.editUserProfile()}>{editButtonText}</Button>
                );
            }
        }

        if(this.state.isEditing){
            editArea = (
                <div>
                    <input type="text" 
                        placeholder="City, State" 
                        value={this.state.value.location}
                        onChange={(evt) => this.handleChange(evt, "location")}/>
                    <input type="text" 
                        placeholder="Interest Label #1" 
                        value={this.state.value.interestTitle1}
                        onChange={(evt) => this.handleChange(evt, "interestTitle1")}/>
                    <input type="text" 
                        placeholder="Interest #1" 
                        value={this.state.value.interest1}
                        onChange={(evt) => this.handleChange(evt, "interest1")}/>
                    <input type="text" 
                        placeholder="Interest Label #2" 
                        value={this.state.value.interestTitle2}
                        onChange={(evt) => this.handleChange(evt, "interestTitle2")}/>
                    <input type="text" 
                        placeholder="Interest #2" 
                        value={this.state.value.interest2}
                        onChange={(evt) => this.handleChange(evt, "interest2")}/>
                    <input type="text" 
                        placeholder="Interest Label #3" 
                        value={this.state.value.interestTitle3}
                        onChange={(evt) => this.handleChange(evt, "interestTitle3")}/>
                    <input type="text" 
                        placeholder="Interest #3" 
                        value={this.state.value.interest3}
                        onChange={(evt) => this.handleChange(evt, "interest3")}/>
                </div>
            );
        }

         if (this.props.params.userID) {
            chitChat = (
                <Button onClick={() => this.findConvos()}>Chitchat</Button>
            );
        }

        if(this.state.displayName && this.state.value){
            var userImage = {
                background: "url(" + this.state.photoURL + "?s=400)",
                'backgroundRepeat': 'no-repeat',
                'backgroundSize': 'cover'
            }
            

            profileContent = (
                    <div className='card-wrapper'>
                        <div className='main-window' id='main-window'>
                            <div className='user-image' style={userImage}>
                                <div className='username'>{this.state.displayName}</div>
                            </div>
                            <div className='user-info'>
                                <div className='quote'>{this.state.value.location}</div>
                            </div>
                            <div className='social-info'>
                                <div className='social-info-elm'>{this.state.value.interestTitle1}
                                    <div className='lg'>{this.state.value.interest1}</div>
                                </div>
                                <div className='social-info-elm'>{this.state.value.interestTitle2}
                                    <div className='lg'>{this.state.value.interest2}</div>
                                </div>
                                <div className='social-info-elm'>{this.state.value.interestTitle3}
                                    <div className='lg'>{this.state.value.interest3}</div>
                                </div>

                            </div>
                            <div className='quote'>{chitChat}</div>
                            <div className='quote'>{editButton}</div>
                            {editArea}
                        </div>
                    </div>
                
            );
        }
        
        return (
            <div className='container' id='container'>  
                {profileContent}
            </div>
        );
    }
}

Profile.contextTypes = {
    router: React.PropTypes.object
};