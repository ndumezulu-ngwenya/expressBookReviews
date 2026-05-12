const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        let review = req.query.review;
        // Retrieve username from session
        let reviewer = req.session.authorization['username']; 
        
        if (review) {
            book.reviews[reviewer] = review; // Add or update the review
            books[isbn] = book;
            return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
        } else {
            return res.status(400).send("Review text not provided!");
        }
    } else {
        return res.status(404).send("Unable to find this book!");
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn].reviews;

    if (filtered_review[reviewer]) {
        delete filtered_review[reviewer]; // Delete only the logged-in user's review
        return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`);
    } else {
        return res.status(404).send("Review not found for this user!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
