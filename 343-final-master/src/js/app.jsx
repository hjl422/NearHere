import React from "react";
import {Link, IndexLink} from "react-router";
import firebase from 'firebase';
import {Layout, Header, Navigation} from "react-mdl";

export default class App extends React.Component{
    constructor(props){
        super(props);
    }

    handleSignOut(){
        // Attempting to sign user out
        console.log("Signout pressed");
        firebase.auth().signOut();
        this.context.router.push("/signin");
    }

    render(){
        return (
            <Layout fixedHeader>
                <Header title={<span>NearHere</span>}>
                    <Navigation>
                         <Link to="/profile" activeClassName="active">Profile</Link>
                         <IndexLink to="/" activeClassName="active">Feed</IndexLink>
                         <Link to="/messages" activeClassName="active">Messages</Link>
                         <a onClick={() => this.handleSignOut()}>Sign Out</a>
                    </Navigation>
                </Header>
                <main>
                    {this.props.children}
                </main>
            </Layout>  
        );
    }
}

// Used for programatically routing user
App.contextTypes = {
    router: React.PropTypes.object  
};