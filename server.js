require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = 3000;
const users = require("./users");
const transactions = require("./transactions");
// const bodyParser = require("body-parser"); // Remember to freaking post JSON and not "text"

app.use(express.json());

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

app.post("/posts", (req, res) => {
  // Retrieve token from body
  const authToken = req.headers.token;
  //validate token
  const decoded = jwt.verify(authToken, process.env.TOKEN_SECRET);
  if (!decoded) {
    res.status(403).end;
  } else {
    const username = decoded.data;
    const userTransactions = transactions[username];
    res.status(200).json({ transactions: userTransactions });
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
