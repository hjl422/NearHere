import React from "react";
import {Link, IndexLink} from "react-router";
import {Layout, Header, Navigation} from "react-mdl";

export default class extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Layout fixedHeader>
                <Header title={<span>NearHere</span>}>
                    <Navigation>
                        <IndexLink to="/signin" activeClassName="active">Sign In</IndexLink>
                         <Link to="/signup" activeClassName="active">Sign Up</Link>
                    </Navigation>
                </Header>
                <main>
                    {this.props.children}
                </main>
            </Layout>
        );
    }
}