//DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = 3000;
const users = require("./users");
const transactions = require("./transactions");
// const bodyParser = require("body-parser"); // Remember to freaking post JSON and not "text"

// MIDDLEWARE
app.use(express.json());

const verifyToken = (req, res, next) => {
  try {
    // Retrieve token from body
    const authToken = req.headers.token;
    // Validate token
    const decoded = jwt.verify(authToken, process.env.TOKEN_SECRET);
    const username = decoded.data;
    // Set username and move the function along
    req.user = username;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (users[username].password !== password) {
    res.status(403).send("Unauthorised");
  } else {
    const newToken = jwt.sign(
      {
        data: username,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60,
      }
    );
    res.status(200).json({ token: newToken });
  }
});

app.post("/posts", verifyToken, (req, res) => {
  const username = req.user;
  const userTransactions = transactions[username];
  res.status(200).json({ transactions: userTransactions });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
