require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const userslogin = require("./models/loginSchema");
const cors = require("cors");
const router = require("./routes/router");

const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("server started");
});
app.use(router);

app.listen(PORT, () => {
  console.log(`server is start port number ${PORT}`);
});
