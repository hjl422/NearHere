import React from "react";
import {Link} from "react-router";
import firebase from 'firebase';
import {Textfield, Button} from "react-mdl";

export default class SignIn extends React.Component{
    constructor(props){
        super(props);

        this.state = {value: {
            email: "",
            password: ""
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

    // attempts to sign the user in
    submitForm(evt){
        evt.preventDefault();
        if(this.validateInputs()){
            firebase.auth().signInWithEmailAndPassword(this.state.value.email, this.state.value.password)
                .then(this.routeHome())
                .catch(function(err){
                    console.log(err); // Cannot read property 'context' of undefined(…) what causes this error
                });
        }
    }

    routeHome(){
        this.context.router.push("/"); // routes user to given path
    }

    // Placeholder for proper validation
    validateInputs(){
        return true;
    }

    render(){
        return (
            <div className="mdl-layout__content login">
                <h1>Sign In</h1>
                <form id="signin-form" action="" className="sign-form" onSubmit={(evt) => this.submitForm(evt)}>
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
                        type="password"
                        onChange={(evt) => this.handleChange(evt, "password")}
                        label="Your Password"
                        value={this.state.value.password}
                        floatingLabel
                        style={{width: '250px'}}
                    />
                    <br/>
                    <Button type="submit" raised accent ripple className="button">Sign In</Button>
                    <br/><br/>
                     <p className="account-text">Don't have an account yet? <Link to="/signup">Sign Up</Link></p>
                </form>
            </div>
        );
    }
}

// Used for programatically routing user
SignIn.contextTypes = {
    router: React.PropTypes.object  
};