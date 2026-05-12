const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
try {
        // Simulating an asynchronous database fetch with a Promise
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });

        // Wait for the promise to resolve
        const allBooks = await getBooks;
        
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).send("Error fetching books");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    // Using Promise callbacks
    getBookByIsbn
        .then((book) => {
            res.status(200).send(book);
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            let filtered_books = [];
            for (let isbn in books) {
                if (books[isbn].author === author) {
                    filtered_books.push(books[isbn]);
                }
            }
            if (filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                reject("No books found by this author");
            }
        });

        const result = await getBooksByAuthor;
        res.status(200).send(result);
    } catch (error) {
        res.status(404).send(error);
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve, reject) => {
        let filtered_books = [];
        for (let isbn in books) {
            if (books[isbn].title === title) {
                filtered_books.push(books[isbn]);
            }
        }
        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject("No books found with this title");
        }
    });

    getBooksByTitle
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
