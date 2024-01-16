const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = 'LOGINGUSER'

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });

    req.user = user;
    next();
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log(req.body);

  // Find the user by username
  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

  res.json({ token,message:"user loging Sucessfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn",authenticatedUser, (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username;

  // Check if the book with the given ISBN exists
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the user has already posted a review for this ISBN
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // If the user has already posted a review, modify the existing one
    books[isbn].reviews[username] = review;
  } else {
    // If the user hasn't posted a review, add a new one
    books[isbn].reviews[username] = review;
  }

  res.json({ message: 'Review posted successfully', isbn, username, review });
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
