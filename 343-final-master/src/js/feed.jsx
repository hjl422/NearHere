// Unsure if I need this
"use strict";

import React from "react";
import Moment from "moment";	
import firebase from 'firebase';
import {Card, CardTitle, CardText, Button, Textfield, RadioGroup, Radio} from "react-mdl";
import {Link, IndexLink} from "react-router";	


export default class Feed extends React.Component{
    constructor(props){
        super(props);

		this.firebaseRef;
		// State has reference to firebase object
		this.state = {
			db : firebase,
		 	sort: function(p1, p2) {
					if(Moment(p1.val().timestamp).isBefore(Moment(p2.val().timestamp))) {
						return 1;
					} else {
						return -1;
					}
				},
			user: null,
			coords: this.props.route.coords
		};

		//this.setPosition = this.setPosition.bind(this);
		this.onPress = this.onPress.bind(this);
    }

	setPosition(pos) {
		this.setState(
			{
				coords: {
					lat: pos.coords.latitude,
					long: pos.coords.longitude
				}
			});
		//console.log("Location has been updated", this.pos.coords);
	}

	// Takes in a ref from firebase, and this (i know i know, wtf)
	// and applies method for updating as messages are made.
	//
	// I have a feeling that I am implementing this slightly wrong.
	// Will refactor it later. For now, it works
	//
	// Should probably consider binding to (this) as I did in the
	// message delete div.
	
	firebaseSetup() {
		firebase.auth().onAuthStateChanged((user) => {
            if (user) {
				this.setState({user: user});
            }else{
				this.context.router.push("/signin");
            }
        });
	}

    componentDidMount() {
		this.firebaseSetup();
		// Passed in "this" because weird
		this.firebaseRef = firebase.database().ref("posts");
		this.firebaseRef.on('value', function(snap) {
			var posts = [];
			snap.forEach(post => {
				posts.push(post);
			});
			this.setState({posts: posts});
		}.bind(this));	
		// If the user is inside the post text area, and presses enter, it will submit a post
		window.addEventListener("keydown", (evt) => this.listenForEnter(evt));

		if(navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => this.setPosition(pos));
			navigator.geolocation.watchPosition((pos) => this.setPosition(pos));
			console.log("Sent location set request...");
		}
	}

	listenForEnter(evt){
		if(evt.key == 'Enter' && document.activeElement == document.getElementById("post-content")) {
			evt.preventDefault();
			document.getElementById("Submitter").click();
		}
	}

	componentWillUnmount(){
		//window.removeEventListener("keydown", this.listenForEnter());
		this.firebaseRef.off();
		this.props.route.coords = this.state.coords;
	}

	distanceFrom(coords1, coords2) {
		var lat1 = coords1.lat;
		var lon1 = coords1.long;
		var lat2 = coords2.lat;
		var lon2 = coords2.long;
		
		var R = 6371; // Radius of the earth in km
		var dLat = (Math.PI/180)*(lat2-lat1);  
		var dLon = (Math.PI/180)*(lon2-lon1); 
		var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos((Math.PI/180)*(lat1)) * Math.cos((Math.PI/180)*(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c * 3280.84; // Distance in km
		
		return d;
	}

	onPress(evt) {
		var b1 = document.getElementById("button1");
		var b2 = document.getElementById("button2");

		if(evt.target == b1) {
			b1.classList.add("sort-type-active");
			b2.classList.remove("sort-type-active");
		} else {
			b2.classList.add("sort-type-active");
			b1.classList.remove("sort-type-active");
		}

		console.log(evt.target.value);
		this.chooseSort(evt.target.value);
	}

	chooseSort(type, thisThing) {
		if(type == 'time') {
			this.setState({
				sort: function(p1, p2) {
					if(Moment(p1.val().timestamp).isBefore(Moment(p2.val().timestamp))) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		} else {
			this.setState({
				sort: function(p1, p2) {
					if(this.distanceFrom(this.state.coords, p1.val().coords) < 
					this.distanceFrom(this.state.coords, p2.val().coords)) {
						return -1;
					} else {
						return 1;
					}
				}.bind(this)
			});
		}
	}


    render() {
        var messages;
		var messageSubmit;
		var select;

			//if(this.state.coords){
		if(this.state.posts && this.state.user) {
			messages = this.state.posts.sort(this.state.sort).map(post => 
				<MessageCard 
					key={post.val().authorID + post.val().timestamp} 
					snap={post} 
					db={this.state.db}
					coords={this.state.coords}
					user={this.state.user}/>);
		}

		if(this.state.user && (this.state.coords.lat != 0) && (this.state.coords.long != 0)){
			messageSubmit = (
				<MessageSubmit 
					db={this.state.db} 
					coords={this.state.coords}
					user={this.state.user}/>
			);
		}

		if(this.state.user){
			// Unfortunately, I don't know how to get mdl to work without including this label
			// On a side note, mdl is not as easy as it should be when fused with react.
			select = ( 
				<div className="sort-select">
					<Button className="sort-type" id="button1" value="dist" onClick={evt => this.onPress(evt)}>Nearby</Button>
					<Button className="sort-type-active sort-type" id="button2" value="time" onClick={evt => this.onPress(evt)}>Recent</Button>
				</div>
			);
		}
		//}
		

		// Page consists of submission box and the string of posts
        return (
            <div>
				{messageSubmit}
				{select}
				{messages}
            </div>
        )
    }
}

class MessageCard extends React.Component {
    constructor(props) {
        super(props)

		this.state = ({
			post: this.props.snap.val()
		});
    }


	distanceFrom(coords1, coords2) {
		var lat1 = coords1.lat;
		var lon1 = coords1.long;
		var lat2 = coords2.lat;
		var lon2 = coords2.long;
		
		var R = 6371; // Radius of the earth in km
		var dLat = (Math.PI/180)*(lat2-lat1);  
		var dLon = (Math.PI/180)*(lon2-lon1); 
		var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos((Math.PI/180)*(lat1)) * Math.cos((Math.PI/180)*(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c * 3280.84; // Distance in km
		
		if(coords2.lat == 'none') {
			return "";
		} else if( d <= 100) {
			return "< 100 feet away";
		} else if(d < 500) {
			return "< 500 feet away";
		} else {
			return Math.round(d / 528) / 10 + " miles away";
		}
	}

    render() {
		var del = {};
		if(this.state.post.uid == this.props.user.uid) {
			del = <MessageDelete snap={this.props.snap} db={this.props.db}/>;
		} else {
			// Don't change del
			del = "";
		}
		return (
			<Card shadow={3} className="card">			
					<CardTitle onClick={() => this.handleClickName(this.state.post.uid)}>
						<Link className="profile-link" to={"/profile/" + this.state.post.uid}>
							{this.state.post.authorID} 
						</Link>
						<span className="time-stamp">{this.distanceFrom(this.state.post.coords, this.props.coords)}</span>
						<span className="time-stamp right-align">{Moment(this.state.post.timestamp).fromNow()}</span>
					</CardTitle>
				<CardText>
					<img className="profile-pic" src={this.state.post.photoURL} />	
					<p className="post-content">{this.state.post.text}</p>					
					{del}
				</CardText>
			</Card>
        )
    }
}

class MessageSubmit extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			content: ""
		}
    }

	pushPost(evt) {
		var this1 = this;
		evt.preventDefault();
		evt.persist();
		if(evt.target.content.value != "") {
				this1.props.db.database().ref("posts").push({authorID: this.props.user.displayName,
							coords: {lat: this.props.coords.lat,
									 long: this.props.coords.long},
							text: this.state.content,
							timestamp: Moment().toISOString(),
							uid: this.props.user.uid,
							photoURL: this.props.user.photoURL
						});	
		}
		this.setState({
			content: ""
		});
	}

    handleChange(evt) {
        this.setState({content: evt.target.value});
    }

    render() {
        return (
			<form id="post-form" onSubmit={evt => this.pushPost(evt)}>
				<Textfield
					name="content"
					onChange={evt => this.handleChange(evt)}
					label="Type a new message!"
					style={{width: '600px'}}
					value={this.state.content}
				/>
				<Button type="submit">Submit Post</Button>
			</form>
        )
    }
}

class MessageDelete extends React.Component {
    constructor(props) {
        super(props)
		
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.db.database().ref("posts").child(this.props.snap.getKey()).remove();
	}

    render() {
		
        return (
            <Button className="delete-button" onClick={this.handleDelete}>X</Button>
        )
    }
}


// Used for programatically routing user
Feed.contextTypes = {
    router: React.PropTypes.object  
};
MessageCard.contextTypes = {
    router: React.PropTypes.object  
};

