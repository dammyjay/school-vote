const express = require("express");
const router = express.Router();
const pool = require("../Models/db");
const voteController = require("../Controllers/voteController");

// Show voting page
router.get("/", async (req, res) => {
  const student = req.session.student;
  if (!student) return res.redirect("/student/login");

  const categories = await pool.query("SELECT * FROM categories");
  const candidates = await pool.query("SELECT * FROM candidates");

  res.render("student/votePage", {
    student,
    categories: categories.rows,
    candidates: candidates.rows,
  });
});

// Vote submission
router.post("/submit", voteController.vote);

module.exports = router;
