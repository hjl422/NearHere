import React from "react";
import {Link} from "react-router";
import md5 from "js-md5";
import firebase from 'firebase';
import {Textfield, Button} from "react-mdl";

export default class SignUp extends React.Component{
    constructor(props){
        super(props);

        this.state = {value: {
            email: "",
            name: "",
            password1: "",
            password2: ""
        }};
    }

    componentWillMount(){
        this.firebaseSetup();
    }

    firebaseSetup(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Logged in already
                this.context.router.push("/"); // routes user to given path
            }else{
                // Not logged in
            }
        });
    }

    // Handles changes in the pages forms
    handleChange(evt, key){
        this.state.value[key] = evt.target.value;
        this.forceUpdate();
    }

    // Attempt to create an account for the user
    submitForm(evt){
        evt.preventDefault();
        
        if(this.validateInputs()){
            firebase.auth().createUserWithEmailAndPassword(this.state.value.email, this.state.value.password1)
                .then((user) => this.createFirebaseUser(user))
                .then(function(){
                    this.context.router.push("/"); // routes user to given path
                }).catch(function(err){
                    console.error(err);
                });
        }
    }

    createFirebaseUser(user){
        // push user data to user data area so it can be accessed by
        // other users
        var refString = "users/"+user.uid;
        var userRef = firebase.database().ref(refString);
        user.updateProfile({
            displayName: this.state.value.name,
            photoURL: "https://www.gravatar.com/avatar/" + md5(this.state.value.email),
            uid: user.uid
        });
        userRef.set({
            email: this.state.value.email,
            displayName: this.state.value.name,
            photoURL: "https://www.gravatar.com/avatar/" + md5(this.state.value.email),
            uid: user.uid
        });
    }

    // Tests that the inputs are valid so that firebase doesnt have to
    validateInputs(){
        if(!this.state.value.name){
            alert("Display name can't be blank");
            return false;
        }else if(this.state.value.password1.length < 6){
            alert("Password must be greater than 6 characters");
            return false;
        }else if(this.state.value.password1 != this.state.value.password2){
            alert("Passwords must match");
            return false;
        }else{
            return true;
        }
    }

    render(){
        return(
            <div className="mdl-layout__content login">
                <h1>Sign Up</h1>
                <form id="signup-form" action="" className="sign-form" onSubmit={(evt) => this.submitForm(evt)}>
                    <Textfield
                        type="text"
                        onChange={(evt) => this.handleChange(evt, "email")}
                        label="Your Email Address"
                        value={this.state.value.email}
                        floatingLabel
                        style={{width: '250px'}}
                    />
                    <br/>
                    <Textfield
                        type="text"
                        onChange={(evt) => this.handleChange(evt, "name")}
                        label="Your Display Name"
                        value={this.state.value.name}
                        floatingLabel
                        style={{width: '250px'}}
                    />
                    <br/>
                    <Textfield
                        type="password"
                        onChange={(evt) => this.handleChange(evt, "password1")}
                        label="Your Password"
                        value={this.state.value.password1}
                        floatingLabel
                        style={{width: '250px'}}
                    />
                    <br/>
                    <Textfield
                        type="password"
                        onChange={(evt) => this.handleChange(evt, "password2")}
                        label="Confirm Your Password"
                        value={this.state.value.password2}
                        floatingLabel
                        style={{width: '250px'}}
                    />
                    <br/>
                    <Button type="submit" raised accent ripple className="button">Sign Up</Button>
                    <br/><br/>
                     <p className="account-text">Already have an account? <Link to="/signin">Sign In</Link></p>
                </form>
            </div>
        );
    }
}

// Used for programatically routing user
SignUp.contextTypes = {
    router: React.PropTypes.object  
};
