// Imports
const nedb = require('gray-nedb');
const userDB = new nedb({ filename: './databases/userDB.db', autoload: true });
const bcrypt = require('bcrypt');
const { resolve } = require('path');
const saltRounds = 10;


class UserDAO
{
    constructor(username, password) 
    {
        this.username = username;
        this.password = password;
    }

    // Method for CREATING a User
    create(username, password) 
    {
        // Uses bcrypt to hash the password
        bcrypt.hash(password, saltRounds).then(function(hash)
        { 
            // Creating an Entry
            var entry = 
            { 
                user: username, 
                password: hash,
                role: 'user'
            }; 
            
            // Inserts the created entry into userDB
            userDB.insert(entry, function (err) 
            {
                if (err) // Catches any errors
                { 
                    console.log("Can't insert user:", username);
                }
            });
        }); 
    }

    // Method for creating an Admin
    createAdmin(username, password, role) 
    {
        // Uses bcrypt to hash the password
        bcrypt.hash(password, saltRounds).then(function(hash)
        { 
            // Creating an Entry
            var entry = 
            { 
                user: username, 
                password: hash,
                role: role
            }; 
            
            // Inserts the created entry into userDB
            userDB.insert(entry, function (err) 
            {
                if (err) // Catches any errors
                { 
                    console.log("Can't insert user:", username);
                }
            });
        }); 
    }

    // Method for LOOKING UP a User
    lookup(user, cb) 
    { 
        // Looks up the passed in User in Database
        userDB.find({'user':user}, function (err, entries) 
        { 
            if (err) // Catches if there's an error
            { 
                return
                cb(null, null);
            } 
            else 
            { 
                if (entries.length == 0) // Catches null entries
                { 
                    return cb(null, null);
                } 
                
                return cb(null, entries[0]);
            }
        });
    }

    // Method for Loading All Users
    loadAllUsers()
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => 
        {
            // Uses the 'find' function to search for all Users with the role 'user'
            userDB.find({'role': 'user'}, function(err, users)
            {
                if(err) // Catches any errors
                {
                    reject(err);
                }
                else    // Else resolves with a list of Users
                {
                    resolve(users)
                    console.log("Function returns: ", users);
                }
            });
        });
    }

    // Method for Deleting a User
    deleteUser(userId, cb) 
    {
        // Uses the 'remove' function to delete the passed in User by their ID
        userDB.remove({ _id: userId }, {}, (err, numRemoved) =>
        {
            if (err)    // Catches any errors
            {
                return cb(err);
            } 
            else 
            {
                console.log('Deleted ${numRemoved} user(s)');
                return cb(null);
            }
        });
    }

}

const dao = new UserDAO();

module.exports = UserDAO;