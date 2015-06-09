# tvTourney
## A interactive and customizable fantasy-football-style app where users choose the rules for their favorite tv shows.

## Getting Started
1. Clone the repo.
2. Inside the folder, npm install.
3. Do the same with bower install.
4. Switch to the server folder and do a npm install.
5. Create a folder named "logs" inside the server folder.
6. To run backend tests, go into the specs folder of server and in terminal type mocha apispecs.js
7. Use karma for the front-end tests.

## Style
This app adheres to the the airbnb-javascript style-guide.

## Possible improvements:
* Comprehensive data / input validation: inputs should be validated on the client, on the server (in the route handlers), and in the database (specifying unique columns and which columns are allowed to be null etc)
* Production grade authentication / encryption - Passwords are currently stored in plain text
* Oath and ability to invite friends by email - even if they don't have an account
* Angular animations / general styling improvements
* Chatroom for users in a league together
* Alternative playing modes - There are a lot of opportunities to get creative here
* Mobile app - Ionic
* Sound effects
* Tv Show presets - For example, you select the bachelor and characters / events are automatically loaded in. Also, would be cool if you could upload CSV's of characters / events
* Refactor tests and route handlers - split them up into logical / functional groupings
* Play with / earn virtual money
* Ability to leave a league
* Test to show that when an event is triggered on a character the score of that character in the roster table is updated - this functionality is working, but there is no test for it yet

## Known issues / bugs:
* Lacks delete functions in roster selection

