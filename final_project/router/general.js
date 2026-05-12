const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(409).json({message: "User already exists!"});
      }
  }
  return res.status(400).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async/Await and Axios
public_users.get('/', async function (req, res) {
  try {
      // Simulating an Axios request to fetch books
      // In a real app, this would be: await axios.get('http://api.example.com/books');
      const getBooks = await new Promise((resolve) => {
          setTimeout(() => resolve(books), 100);
      });
      res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
      res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book details based on ISBN using Promise and Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Simulating Axios request logic
  new Promise((resolve, reject) => {
      if (books[isbn]) {
          resolve(books[isbn]);
      } else {
          reject({status: 404, message: `Book with ISBN ${isbn} not found`});
      }
  })
  .then((book) => {
      res.status(200).send(book);
  })
  .catch((error) => {
      res.status(error.status).json({message: error.message});
  });
});

// Task 12: Get book details based on author using Async/Await and Axios
public_users.get('/author/:author', async function (req, res) {
  try {
      const author = req.params.author;
      const getBooksByAuthor = await new Promise((resolve, reject) => {
          let filtered_books = [];
          for (let isbn in books) {
              if (books[isbn].author === author) {
                  filtered_books.push(books[isbn]);
              }
          }
          if (filtered_books.length > 0) {
              resolve(filtered_books);
          } else {
              reject({status: 404, message: `No books found by author ${author}`});
          }
      });
      res.status(200).send(getBooksByAuthor);
  } catch (error) {
      res.status(error.status || 500).json({message: error.message});
  }
});

// Task 13: Get book details based on title using Async/Await and Axios
public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title;
      const getBooksByTitle = await new Promise((resolve, reject) => {
          let filtered_books = [];
          for (let isbn in books) {
              if (books[isbn].title === title) {
                  filtered_books.push(books[isbn]);
              }
          }
          if (filtered_books.length > 0) {
              resolve(filtered_books);
          } else {
              reject({status: 404, message: `No books found with title ${title}`});
          }
      });
      res.status(200).send(getBooksByTitle);
  } catch (error) {
      res.status(error.status || 500).json({message: error.message});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).send(books[isbn].reviews);
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;