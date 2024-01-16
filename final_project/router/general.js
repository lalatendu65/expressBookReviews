const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let{username,password}=req.body
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // If the username is not taken, create a new user
  const newUser = { username, password };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully', user: newUser });
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (Object.values(books).some(book => book.isbn === isbn)) {
    // Find the book by ISBN and send it as a response
    const book = Object.values(books).find(book => book.isbn === isbn);
    res.json(book);
  } else {
    res.status(404).send('Book not found');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Filter books by the given author
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).send('Books not found for the given author');
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  // Filter books by the given title
  const matchingTitle = Object.values(books).filter(book => book.title === title);

  if (matchingTitle.length > 0) {
    res.json(matchingTitle);
  } else {
    res.status(404).send('Books not found for the given Title');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code herereturn res.status(300).json({message: "Yet to be implemented"});
  let isbn = req.params.isbn;
const matchingIsbn = Object.values(books).filter(book => book.isbn === isbn);

if (matchingIsbn.length > 0) {
  const book = matchingIsbn[0]; // Access the first (and only) element of the array
  res.send(book.reviews);
} else {
  res.status(404).send('Book not found for the given ISBN');
}
});

module.exports.general = public_users;
