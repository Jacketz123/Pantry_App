// Imports
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const user = new userModel;


// (LOGIN) Function that handles the Login of a User
exports.login = function (req, res,next)
{
  // Take strings from page
  let username = req.body.username;
  let password = req.body.password;

  // Uses 'lookup' function in userModel to retrieve information
  user.lookup(username, function (err, user)
  {
    if (err) // Catches errors
    {
      console.log("Error Looking Up User", err);
      return res.status(401).send();
    }
    if (!user) // Catches if User does not exist
    {
      console.log("User: '", username, "' Not Found");
      return res.render("register");
    }
    console.log(user)

    //Uses BCrypt to compare provided password with stored password
    bcrypt.compare(password, user.password, function (err, result) 
    {
      console.log(result)

      if (result) 
      {
        // Use the payload to store information about the User
        let payload = { username: username, role: user.role };

        // Create the Access Token 
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300}); 
        res.cookie("jwt", accessToken);

        // Assigning variable to pass through role
        req.userRole = user.role;

        next();
      } 
      else  // If you can't, redirect back to Login page
      {
        return res.render("login");
      }
    });
  });
};


// (VERIFY) Function to Verify a User
exports.verify = function (req, res, next) 
{
  // Assigning Access Token Variable
  let accessToken = req.cookies.jwt;

  if (!accessToken) // Catches if no Access Token is present
  {
    return res.redirect("/login");
  }

  let payload;

  try  // Try to verify the token
  {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } 
  catch (e) // Catches if request is unauthorized 
  {
    res.status(401).send();
  }
};

// (VERIFY PANTRY) Function that verifies a Pantry
exports.verifyPantry = function (req, res, next) 
{
  try
  {
    // Assigning Variables
    let accessToken = req.cookies.jwt;
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (payload.role != "pantry") // Throws Error if User Role is NOT pantry
    {
      return res.status(403).send();
    }

    try // Try to move to the next Middleware
    {
      next();
    } 
    catch (e) // If you can't, throw Unauthorized Error
    {
      res.status(401).send();
    }
  }
  catch // Catches if no access token is present
  {
    return res.status(403).send();
  }
};

// (VERIFY ADMIN) Function that verifies an Admin
exports.verifyAdmin = function (req, res, next) 
{
  try
  {
    // Assigning Variables
    let accessToken = req.cookies.jwt;
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (payload.role != "admin") // Throws Error if User Role is NOT Admin
    {
      return res.status(403).send();
    }

    try // Try to move to the next Middleware
    {
      next();
    } 
    catch (e) // If you can't, throw Unauthorized Error
    {
      res.status(401).send();
    }
  }
  catch // Catches if no access token is present
  {
    return res.status(403).send();
  }
};