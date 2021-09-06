# Final Rose Fantasy 

## Motivation
Yes, there are other Bachelor/Bachelorette fantasy leagues that are well established where you can earn or lose points for contestants on your "team" completing actions like getting a rose or going on a horseback riding date or being shirtless on camera. However, most of these leagues will penalize you if your contestant behaves poorly. I believe that the drama is often the best part of this guilty-pleasure TV show and have created a new fantasy league that will reward you if your contestant cries (+10) or vomits (+12) or gets a word bleeped out (+7). Contestants on the "most dramatic season ever" deserve to earn points for causing drama, and this fantasy league website allows you to pick your team using our handy "Pick Contestant" tool, and the website (and its dedicated host) will take care of the rest.

## Links
  Demo Webpage: https://finalrosefantasydemo.herokuapp.com/ <br>
  Explanatory Video: https://youtu.be/9Sw10J6ol-I  <br>
  Original Webpage: https://finalrosefantasy.herokuapp.com/  <br>

## Stack Information and Resources
This web applicaiton uses a MERN stack (MongoDB, Express, React, NodeJS).

### Resouces
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://www.mongoosejs.com/)
* [Express](https://github.com/expressjs/express)
* [React](https://github.com/facebook/react)
* [NodeJS](https://github.com/nodejs/node)
* [Heroku](https://www.heroku.com/)
* [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
* [JSON Web Tokens](https://jwt.io/)

Other dependencies can be found in in [`package.json`](package.json).

## API Documentation

![ContestantPicker](https://github.com/rcorr13/finalrosefantasy/blob/main/public/ContestantPicker.gif)


### Users

Register User:
 * URL: https://finalrosefantasy.herokuapp.com/register
 * Type: POST
 * Request Body: Array with user firstname, lastname, email, password, and confirmed password
 * Response: JSON with user information
  
Login User:
 * URL: https://finalrosefantasy.herokuapp.com/login
 * Type: POST
 * Request Body: Array with user email and password
 * Response: JSON with JWT token

Update Password:
 * URL: https://finalrosefantasy.herokuapp.com/updatepassword
 * Type: PUT
 * Request Body: Array with user information, old password, new passowrd, and confirmed new password
 * Response: JSON with updated user
  
Update User:
 * URL: https://finalrosefantasy.herokuapp.com/updateuser/:_id
 * Type: PUT
 * Request Body: Array with updated user information
 * Request Params: User ID
 * Response: JSON of users (with updated user)
  
Get Users:  
 * URL: https://finalrosefantasy.herokuapp.com/users
 * Type: GET
 * Request: None
 * Response: JSON with all users
  
### Contestants
  
Get Contestants:  
 * URL: https://finalrosefantasy.herokuapp.com/contestants
 * Type: GET
 * Request: None
 * Response: JSON with all contestants

Add Contestant:  
 * URL: https://finalrosefantasy.herokuapp.com/addcontestant
 * Type: POST
 * Request Body: Array with contestant name, nameLink, age, job, city, stateUS, status, imageLink, and totalpoints
 * Response: Response status code

Update Contestant:  
 * URL: https://finalrosefantasy.herokuapp.com/updatecontestant/:nameLink
 * Type: PUT
 * Request Body: Array with updated contestant information
 * Request Params: Contestant nameLink
 * Response: JSON with all contestants (with updated contestant)
  
Delete Contestant:  
 * URL: https://finalrosefantasy.herokuapp.com/delete/:nameLink
 * Type: DELETE
 * Request Params: nameLink of contestant to be deleted
 * Response: JSON with all contestants (without deleted contestant)
  
### Logistics 
(includes contestants eliminated a given week, and array of firsts that have occurred)  <br>

Get Logistics:  
 * URL: https://finalrosefantasy.herokuapp.com/logistics
 * Type: GET
 * Request: None
 * Response: JSON with all logistic information

Update Logistics:  
 * URL: https://finalrosefantasy.herokuapp.com/updatelogistics
 * Type: PUT
 * Request: Array with updated logistics information
 * Response: JSON with updated logistics

Set Current Week:  
 * URL: https://finalrosefantasy.herokuapp.com/setCurrentWeek/:currentWeek
 * Type: PUT
 * Request Body: Current logistics information
 * Request Params: Week to set as currentWeek
 * Response: JSON with updated logistics
  
