// Import necessary modules
const bcrypt = require('bcryptjs');
const users = require('./users');  // Assuming you have a MongoDB users collection to interact with

// Register user function with password hashing
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        // Hash the password
        bcrypt.hash(userData.password, 10).then(hash => {
            // Update the userData object with the hashed password
            userData.password = hash;

            // Insert the new user into the database (MongoDB)
            users.insertOne(userData, (err, result) => {
                if (err) {
                    reject("There was an error registering the user");
                } else {
                    resolve(result);
                }
            });
        }).catch(err => {
            console.log(err);
            reject("There was an error encrypting the password");
        });
    });
}

// Check user function with password comparison
function checkUser(userData) {
    return new Promise((resolve, reject) => {
        // Find the user by username
        users.findOne({ userName: userData.userName }, (err, user) => {
            if (err || !user) {
                reject("User not found");
                return;
            }

            // Compare the entered password with the hashed password stored in the database
            bcrypt.compare(userData.password, user.password).then(result => {
                if (result) {
                    resolve(user); // Password matches, return the user object
                } else {
                    reject(`Incorrect Password for user: ${userData.userName}`);
                }
            }).catch(err => {
                console.log(err);
                reject("Error during password comparison");
            });
        });
    });
}

// Export the functions
module.exports = { registerUser, checkUser };
