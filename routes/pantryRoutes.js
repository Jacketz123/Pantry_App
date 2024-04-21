// Imports
const express = require('express'); // Express
const router = express.Router(); // Router
const controller = require('../controllers/pantryControllers.js'); // Controller
const {verifyAdmin, verify, verifyPantry} = require('../auth/auth') // Login & Verify Methods


//----------------- PANTRY ROUTES ------------------\\

// NAVBAR
router.get("/", controller.landing_page);
router.get("/home", controller.landing_page);
router.get("/about", controller.show_about_page);
router.get("/contact", controller.show_contact_page);
router.post("/contact", controller.post_new_contact);

// REGISTER
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);

// LOGIN
router.get('/login', controller.show_login_page);
router.post('/login', controller.handle_login);

// LOGOUT
router.get("/logout", verify, controller.logout);

// DONATE
router.get("/donate", verify, controller.show_donate_page);
router.post("/donate", verify, controller.post_new_donation);

// PANTRY
router.get("/pantryHome", verifyPantry, controller.show_pantry_home_page);
router.post("/pantryHome", verifyPantry, controller.claim_donation);
router.get("/pantryClaimed", verifyPantry, controller.show_pantry_claimed_page);
router.post("/pantryClaimed", verifyPantry, controller.unclaim_donation);

// ADMIN
router.get("/admin", verifyAdmin, controller.show_admin_page);
router.post("/admin", verifyAdmin, controller.deleteUser);
router.get("/adminCreate", verifyAdmin, controller.show_admin_create_page);
router.post("/adminCreate", verifyAdmin, controller.post_admin_create);
router.get("/adminInventory", verifyAdmin, controller.show_inventory_page);
router.post("/adminInventory", verifyAdmin, controller.deleteDonation);
router.get("/adminContact", verifyAdmin, controller.show_admin_query_page);
router.post("/adminContact", verifyAdmin, controller.post_admin_query_page);



//---------------- ERROR RESPONSES ------------------\\

// Error Response - Not Found (404)
router.use(function(req, res) 
{
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

// Error Response - Internal Server Error (500)
router.use(function(err, req, res, next) 
{
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})


module.exports = router;