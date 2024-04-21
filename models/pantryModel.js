// Imports
const nedb = require('gray-nedb');
const pantryDB = new nedb({ filename: './databases/pantryDB.db', autoload: true });
const contactDB = new nedb({ filename: './databases/contactDB.db', autoload: true });


class PantryDAO
{
    // Function that adds a donation to the Database
    addDonation(name, quantity, weight, dateHarvest, dateExpiry, claimed, pantry)
    {
        // Creating donation, using the following attributes
        var donation = 
        {
            name: name,
            quantity: quantity,
            weight: weight,
            dateHarvest: dateHarvest,
            dateExpiry: dateExpiry,
            claimed: claimed,
            pantry: pantry
        }
        console.log('donation created', donation);

        // Inserting donation into the Database
        pantryDB.insert(donation, function (err, doc)
        {
            if (err) // Catches any errors
            {
                console.log('error inserting document', subject);
            } 
            else 
            {
                console.log('document inserted into the database', doc);
            }
        })
    }

    // Function that Deletes a Donation from the Database
    deleteDonation(donationId, cb) 
    {
        // Uses 'remove' to delete the item from pantryDB by ID
        pantryDB.remove({ _id: donationId }, {}, (err, numRemoved) =>
        {
            if (err) // Catches if there's an error
            {
                return cb(err);
            } 
            else 
            {
                console.log('Deleted ${numRemoved} donation(s)');
                return cb(null);
            }
        });
    }

    // Function that loads all Donations from the Database
    loadAllDonations()
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) =>
        {
            // Uses 'find' to retrieve the information from pantryDB
            pantryDB.find({}, function(err, donations) 
            {
                if (err) // Catches if there's an error
                {
                    // If there's no error: resolve the promise & return the data
                    reject(err);
                } 
                else 
                {
                    resolve(donations);

                    // Prints out donations in log
                    console.log('Donations returned: ', donations);
                }
            })
        })
    }

    // Function that loads UNCLAIMED Donations from the Database
    loadUnclaimedDonations()
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) =>
        {
            // Uses 'find' to retrieve the information from pantryDB
            pantryDB.find({ 'claimed': "false" }, function(err, donations) 
            {
                if (err) // Catches if there's an error
                {
                    // If there's no error: resolve the promise & return the data
                    reject(err);
                } 
                else 
                {
                    resolve(donations);

                    // Prints out donations in log
                    console.log('Donations returned: ', donations);
                }
            })
        })
    }

    // Function that loads all Donations from the Database
    loadSpecificDonations(username)
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) =>
        {
            // Uses 'find' to retrieve the information from pantryDB
            pantryDB.find({ 'pantry': username }, function(err, donations) 
            {
                if (err) // Catches if there's an error
                {
                    // If there's no error: resolve the promise & return the data
                    reject(err);
                } 
                else 
                {
                    resolve(donations);

                    // Prints out donations in log
                    console.log('Donations returned: ', donations);
                }
            })
        })
    }

    // Function that allows a pantry to claim a donation
    claimDonation(donationId, username)
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => 
        {
            // Runs 'update' to the specified record by donation ID, changes hidden attributes
            pantryDB.update({ _id: donationId }, { $set: { 'claimed': "true", 'pantry': username } }, {}, function (err, donations) 
            {
                if (err) // Catches any errors
                {
                    console.log('error updating documents', err);
                    reject(err);
                } 
                else 
                {
                    console.log(donations, 'documents updated');
                    resolve(donations); // Resolves the list of donations
                }
            });
        });
    }

    // Function that allows a pantry to unclaim a donation
    unclaimDonation(donationId)
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => 
        {
            // Runs 'update' to the specified record by donation ID, changes hidden attributes back to default values
            pantryDB.update({ _id: donationId }, { $set: { 'claimed': "false", 'pantry': "" } }, {}, function (err, donations) 
            {
                if (err) // Catches any errors
                {
                    console.log('error updating documents', err);
                    reject(err);
                } 
                else 
                {
                    console.log(donations, 'documents updated');
                    resolve(donations);
                }
            });
        });
    }

    // Function that deletes expired donations
    deleteExpiredDonations()
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) =>
        {
            // Variable for Current Date
            const currentDate = new Date();

            // Variables to change date into desired format
            const currentDateISOString = currentDate.toISOString();     // Converts it to a String
            const currentDateOnly = currentDateISOString.split('T')[0]; // Puts it in YYYY-MM-DD format

            // Uses 'remove' to delete expired donations from pantryDB (less than today's date)
            pantryDB.remove({ dateExpiry: { $lt: currentDateOnly  } }, { multi: true }, function(err, donations) 
            {
                if (err) // Catches if there's an error
                {
                    // If there's no error: resolve the promise & return the data
                    reject(err);
                } 
                else 
                {
                    resolve(donations);

                    // Prints out donations in log
                    console.log('Donations deleted: ', donations);
                }
            })
        })
    }

    // Function that writes a contact to the Database
    addContact(name, email, comments)
    {
        // Creating contact
        var contact = 
        {
            name: name,
            email: email,
            comments: comments
        }
        console.log('contact created', contact);

        // Inserting contact into the Database
        contactDB.insert(contact, function (err, doc)
        {
            if (err) // Catches any errors
            {
                console.log('error inserting document', subject);
            } 
            else 
            {
                console.log('document inserted into the database', doc);
            }
        })
    }

    // Function that Loads all Contacts
    loadAllContacts()
    {
        // Return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) =>
        {
            // Uses 'find' to retrieve the information from contactDB
            contactDB.find({}, function(err, contacts) 
            {
                if (err) // Catches if there's an error
                {
                    // If there's no error: resolve the promise & return the data
                    reject(err);
                } 
                else 
                {
                    resolve(contacts);

                    // Prints out contacts in log
                    console.log('Contacts returned: ', contacts);
                }
            })
        })
    }

    // Function to Delete a contact
    deleteContact(contactId, cb) 
    {
        // Uses 'remove' to delete the item from contactDB by ID
        contactDB.remove({ _id: contactId }, {}, (err, numRemoved) =>
        {
            if (err) // Catches if there's an error
            {
                return cb(err); // If there's no error: resolve the promise & return the data
            } 
            else 
            {
                console.log('Deleted ${numRemoved} donation(s)');
                return cb(null);
            }
        });
    }
}


const dao = new PantryDAO();

module.exports = PantryDAO;
