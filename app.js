const initTables = require("./Models/initTables");
const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));

app.set("view engine", "ejs");

// Session
app.use(
  session({
    secret: "votingSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
const adminRoutes = require("./Routes/adminRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const voteRoutes = require("./Routes/voteRoutes");

app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/vote", voteRoutes);

app.get("/", (req, res) => {
  res.render("student/login");
});

initTables();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
