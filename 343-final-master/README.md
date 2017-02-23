# 343-final

For this final challenge, we will be creating a social media platform that allows the users to connect and stay updated with their friends and people in the area.
There will be two main components: newsfeed from friends/people in your area and messaging with individuals or groups.

The user will be able to browse through a newsfeed, in which he/she can toggle between looking at posts from his friends and people in his/her area. If he/she finds a certain activity interesting, he/she can follow that person or connect with the other user as well. For example, if someone posted that they are going hiking, the user could direct message the person and ask to tag along. The user will be able to toggle between the friends newsfeed, in which he will only see posts from people in his connection, and the general newsfeed, in which he will be able to see posts from other people in his area. The newsfeed can also be filtered through radius and friend-groups. Depending on how far the user wants to know about, he can change the radius from his location, i.e. looking at only people who are 5 miles away or 50 miles away. He can also create certain friend groups for different activities; for example, he could have one friend group designated for hiking and another for studying. 

With messaging, the user will be able to directly message a single person or create a private group message in which only those invited can read and post messages. The messenger will be a way to connect in a more private space and coordinate a time to meet or do an activity. 


We will be using Google Drive for idea sharing, Slack for main methods of communication, and our git repo to write our code. 
For the front end, we will be using React.js (FB's new create-react-app?) and Bootcamp/Materialize.
For the backend, we will be using Node.js, Heroku, Postgresql, Express.js, Passport.js, Socket.io, and Facebook authentication.

## For Developers
For front end development make js and scss changes in the src folder, make any needed changes to the html document in public/index.html

index.jsx is the main js file, all the others will be imported in a tree
main.scss is the main scss file, others will be imported

To start webpack server use 'npm run webpack'
Webpack server will be located at localhost:3000/public/index.html

To make a build run 'npm run build'
It will be build to public/bundle.js 

Backend is stored in server.js