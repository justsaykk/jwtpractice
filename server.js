require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username].password === password) {
    res.send("Authenticated!");
  } else {
    res.status(403).send("Unauthenticated");
  }
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
