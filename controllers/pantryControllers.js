// Imports
const pantryDAO = require('../models/pantryModel');
const pantryModel = new pantryDAO();
const userDAO = require('../models/userModel');
const userModel = new userDAO();
const auth = require('../auth/auth')
const jwt = require("jsonwebtoken");


//-----------------------------------------------------------------------------------------
// NAVBAR

// Renders Landing Page
exports.landing_page = function (req, res) 
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("home", // Renders home page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("home");
    }
}

// Renders About Page
exports.show_about_page = function (req, res)
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("about", // Renders about page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("about");
    }
}

// Renders Contact Page
exports.show_contact_page = function (req, res)
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("contact", // Renders contact page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("contact");
    }
}

// Function to write a contact to the Database
exports.post_new_contact = function (req, res)
{
    console.log('processing new contact');

    // Runs the addContact method from pantryModel, passing in the information form the text fields
    pantryModel.addContact(req.body.name, req.body.email, req.body.comments);
    
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("home", // Renders home page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("home");
    }
}

// Renders Donate Page
exports.show_donate_page = function (req, res)
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("donate", // Renders donate page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("donate");
    }
}

// Adds a donation to the Database
exports.post_new_donation = function (req, res)
{
    console.log('processing post_new_donation controller');

    // Assigning variables for hidden attribute default values
    const claimed = "false";
    const pantry = "";

    // Runs the addDonation method from pantryModel, passing in the User inputs and hidden values
    pantryModel.addDonation(req.body.name, req.body.quantity, req.body.weight, req.body.dateHarvest, req.body.dateExpiry, claimed, pantry);
    res.redirect('/donate');
}//----------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
// REGISTER

// Renders Register Page
exports.show_register_page = function(req, res) 
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("register", // Renders register page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("register");
    }
}

// Creates a New User and adds them to the Database
exports.post_new_user = function(req, res) 
{ 
    // Declaring variables
    const user = req.body.username; 
    const password = req.body.pass;

    // Checks for no Username or no password entered
    if (!user || !password) 
    { 
        res.send(401, "No User or no Password"); 
        return;
    }

    // Runs the 'lookup' Function in the userModel to check if a User already exists
    userModel.lookup(user, function(err, u) 
    {
        if (u) // Catches if User exists
        {
            console.log("A User with this Username already exists");
            res.send("User already exists", user, 401);
            return; 
        }

        // If they don't already exist, you can create them
        userModel.create(user, password); 
        console.log("Registered User:", user, "successfully");
        res.redirect('/login');
    });
} //---------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
// LOGIN

// Renders the Login page
exports.show_login_page = function(req, res) 
{
    try
    {
        // Assigning Variables
        let accessToken = req.cookies.jwt;
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(payload) // Checks for payload (if a User is present)
        {
            res.render("login", // Renders login page passing through the User
            {
                user: "user"
            });
        }
    }
    catch   // If not, render the page without passing through a user
    {
        res.render("login");
    }
}

// Handles User to the login
exports.handle_login = function (req, res) 
{ 
    // Call the Login method from Auth
    auth.login(req, res, function (err)
    {
        if (err) // Catches error logging in
        {
            console.error("Error:", err);
            res.render("login");
            return;
        }

        // Assign variable to store role
        const role = req.userRole;
        console.log("User Role:", role);

        // Directs to different pages based on a User's role
        if (role === 'user') 
        {
            res.redirect("/donate");
        } 
        else if (role === 'pantry') 
        {
            res.redirect("/pantryHome");
        } 
        else if (role === 'admin') 
        {
            res.redirect("/admin");
        } 
        else // Catches any errors
        {
            res.status(403).send("Error: Undefined Role");
        }
    });
}

// Logs the current user out
exports.logout = function (req, res) 
{
    res.clearCookie("jwt")  // Clears the JTW cookie upon logout button press and redirects to index page
    .status(200)
    .redirect("/");
} //---------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
// PANTRY

// Loads the Admin Home Page
exports.show_pantry_home_page = function(req, res)
{
    // First Deletes Expired Donations
    pantryModel.deleteExpiredDonations()

    // Then proceeds to load the remainder of the donations
    pantryModel.loadUnclaimedDonations()
        .then((list) => {
            res.render("pantryHome", // Renders pantryHome and passes through list of donations
            {
                donations: list
            });
        })
        .catch((err) => // Catches errors
        {
            console.log("Error Loading Donations:", err);
            res.status(500).send('Error Loading Donations');
        });
}

// Show Pantry Claimed Page
exports.show_pantry_claimed_page = function(req, res)
{
    // First Deletes Expired Donations
    pantryModel.deleteExpiredDonations()

    // Declaring variables
    let accessToken = req.cookies.jwt;
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const username = payload.username;

    // Proceeds to load the donations with the Pantry's own Username
    pantryModel.loadSpecificDonations(username)
        .then((list) => {
            res.render("pantryClaimed", // Renders the pantryClaimed page, passing in the list of their claimed donation
            {
                donations: list
            });
        })
        .catch((err) =>  // Catches any errors
        {
            console.log("Error Loading Donations:", err);
            res.status(500).send('Error Loading Donations');
        });
}

// Deletes a Donation from the Database
exports.claim_donation = function(req, res) 
{
    // Declaring variables
    let accessToken = req.cookies.jwt;
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const username = payload.username;
    const donationId = req.body.donationId;

    // Call the deleteDonation method from pantryModel to delete the donation, passing in donationID and Username
    pantryModel.claimDonation(donationId, username, (err) => 
    {
        if (err) // Catches if there's an error
        {
            console.error("Error claiming donation:", err);
            res.status(500).send("Internal server error");
            return;
        }
    });

    // Redirects to the pantryHome page again after action is performed
    res.redirect("/pantryHome");
}

// Unclaims a Donation from the Database
exports.unclaim_donation = function(req, res) 
{
    // Declaring variables
    const donationId = req.body.donationId;

    // Call the unclaimDonation method from pantryModel to unclaim the donation
    pantryModel.unclaimDonation(donationId, (err) => 
    {
        if (err) // Catches if there's an error
        {
            console.error("Error unclaiming donation:", err);
            res.status(500).send("Internal server error");
            return;
        }
    });

    // Redirects to the pantryClaimed page again after action is performed
    res.redirect("/pantryClaimed");
}//----------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
// ADMIN

// Loads the Admin Page and passes in a List of Users
exports.show_admin_page = function(req, res) 
{
    userModel.loadAllUsers()    // Runs the loadAllUsers method from userModel
        .then((list) => {
            res.render("admin", // Renders admin page with a list of Users
            {
                users: list
            });
        })
        .catch((err) => // Catches any errors
        {
            console.log("Error Loading Users", err);
            res.status(500).send('Error Loading Users');
        });
}

// Loads the Admin Inventory Page
exports.show_inventory_page = function(req, res) 
{
    // First deletes any expired donations
    pantryModel.deleteExpiredDonations()

    // Then proceeds to load the remainder of the donations
    pantryModel.loadAllDonations()
        .then((list) => {
            res.render("adminInventory", // Renders the adminInventory page, passing through a list of donations
            {
                donations: list
            });
        })
        .catch((err) => // Catches any errors
        {
            console.log("Error Loading Donations:", err);
            res.status(500).send('Error Loading Donations');
        });
}


// Deletes a Donation from the Database
exports.deleteDonation = function(req, res) 
{
    // Declaring variable
    const donationId = req.body.donationId;

    // Call the deleteDonation method from pantryModel to delete the donation
    pantryModel.deleteDonation(donationId, (err) => 
    {
        if (err) // Catches if there's an error
        {
            console.error("Error deleting donation:", err);
            res.status(500).send("Internal server error");
            return;
        }

        // Reloads the adminInventory page again after action is performed
        res.redirect("/adminInventory");
    });
}

// Deletes a User from the Database
exports.deleteUser = function(req, res) 
{
    // Declaring variable
    const userId = req.body.userId;

    // Call the deleteUser method from userModel to delete the user
    userModel.deleteUser(userId, (err) => 
    {
        if (err) // Catches if there's an error
        {
            console.error("Error deleting user:", err);
            res.status(500).send("Internal server error");
            return;
        }

        // Reloads the Admin page again after action is performed
        res.redirect("/admin");
    });
}

// Renders page to create a privileged user
exports.show_admin_create_page = function(req, res)
{
    res.render('adminCreate');
}

// Creates a New User and adds them to the Database
exports.post_admin_create = function(req, res) 
{ 
    // Declaring variables
    const user = req.body.username; 
    const password = req.body.pass;
    const ro = req.body.role;

    // Checks for no Username or Password
    if (!user || !password) 
    { 
        res.send(401, "No User or no Password"); // Catches error
        return;
    }

    // Runs the 'lookup' Function in the userModel to check if a User already exists
    userModel.lookup(user, function(err, u) 
    {
        if (u) // Catches if User exists
        {
            console.log("A User with this Username already exists");
            res.send(401, "User exists:", user); 
            return; 
        }

        // If they don't already exist, you can create them
        userModel.createAdmin(user, password, ro); 
        console.log("Registered User: ", user, ", Password: ", password, ", Role: ", ro);
        res.redirect('/adminCreate');
    });
}

// Shows Admin Query Page
exports.show_admin_query_page = function(req, res)
{
    // First loads all contacts from the Database
    pantryModel.loadAllContacts()
        .then((list) => {
            res.render("adminContact", // Renders the adminContact page, passing in a list of contacts
            {
                contacts: list
            });
        })
        .catch((err) => // Catches any errors
        {
            console.log("Error Loading Contacts:", err);
            res.status(500).send('Error Loading Contacts');
        });

    //res.render('adminContact');
}

// Deletes items in the Admin Contact Page
exports.post_admin_query_page = function(req, res) 
{
    // Declaring variable
    const contactId = req.body.contactId;

    // Call the deleteContact method from pantryModel to delete the user
    pantryModel.deleteContact(contactId, (err) => 
    {
        if (err) // Catches if there's an error
        {
            console.error("Error deleting contact:", err);
            res.status(500).send("Internal server error");
            return;
        }

        // Reloads the Admin Contact Page again after action is performed
        res.redirect("/adminContact");
    });
}//----------------------------------------------------------------------------------------
