const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

// Login page
router.get("/login", (req, res) => {
  res.render("student/login");
});

// Login submission
router.post("/login", studentController.login);
router.get("/results", studentController.viewResults);

module.exports = router;
