Hello and welcome to the Pantry Application

The repository can be cloned from your VSCode terminal by typing in the following:

git clone https://github.com/Jacketz123/Pantry_App.git

//-----------------------------------------------------------------------------------------------------------------------

To get started, here are some logins for different types of Users required to perform various functionality on the site. 

Additionally, regular users are able to register their own accounts, and Administrators have the abilty to create accounts 
for Privileged Users (ie. Pantries or Admins), but here are a few pre coded logins to get you started:

//--ADMIN--\\
Username: admin
Password: password

//--PANTRY 1--\\
Username: WestEndPantry
Password: password

//--PANTRY 2--\\
Username: SouthsidePantry
Password: password

//--USER--\\
Username: Jacketz123
Password: password


In order for the application to run, all of the libraries used must have their respective dependencies installed.
Here is a list of all the required dependencies:

"dependencies": 
{
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "bootstrap": "^5.3.3",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "gray-nedb": "^1.8.3",
    "json-web-token": "^3.2.0",
    "jsonwebtoken": "^9.0.2",
    "mustache-express": "^1.3.2",
    "nodemon": "^3.1.0",
    "path": "^0.12.7"
}

All of these can be installed by opening the terminal, and simply typing:   npm install (name)

For example:   npm install mustache-express
