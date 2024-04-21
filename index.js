// Imports for Express
const express = require('express');
const app = express();
require('dotenv').config()

// Import for Cookie Parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Imports for Body Parser Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// Imports for Mustache
const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

// Imports for Path module
const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

// Imports for Router
const router = require('./routes/pantryRoutes');
app.use('/', router); 



//------------------------------------------------------------

app.get('/', function(req, res) 
{
    res.render("home")
})

app.listen(3000, () => 
{
    console.log('Server started on port 3000. Ctrl^c to quit.');
})