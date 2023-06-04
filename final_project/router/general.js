const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  if (!req.body.hasOwnProperty("username")) {
    return res.send("Must include username in the body!");
  }
  if (!req.body.hasOwnProperty("password")) {
    return res.send("Must include password!");
  }

  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    users.push({ username: username, password: password });
    return res.send("User successfully registered!");
  } else {
    return res.send("User already exists!")
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let fetchData = new Promise((resolve, reject) => {
    resolve(books);
  });
  fetchData.then((data) => {
    res.send(JSON.stringify(data, null, 4));
  }).catch((error) => {
    res.status(500).send("Error occurred fetching data.");
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let fetchData = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Could not find book."))
    }
  })
  fetchData.then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(404).send(error.message);
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let fetchData = new Promise((resolve, reject) => {
    const author = req.params.author;
    for (const key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        return resolve(books[key]);
      }
    }
    reject(new Error("Could not find book."));
  })

  fetchData.then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(404).send(error.message);
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let fetchData = new Promise((resolve, reject) => {
    const title = req.params.title;
    for (const key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        return resolve(books[key]);
      }
    }
    reject(new Error("Could not find book."));
  })
  fetchData.then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(404).send(error.message)
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
