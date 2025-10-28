const pool = require("../Models/db");

exports.login = async (req, res) => {
  const { firstname, lastname, voting_id } = req.body;
  const result = await pool.query(
    "SELECT * FROM students WHERE firstname=$1 AND lastname=$2 AND voting_id=$3",
    [firstname, lastname, voting_id]
  );

  if (result.rows.length > 0) {
    req.session.student = result.rows[0];
    res.redirect("/vote");
  } else {
    res.send("Invalid credentials");
  }
};

// Show voting results to students
exports.viewResults = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await pool.query("SELECT * FROM categories");

    // Get candidates with their votes per category
    const results = [];
    for (const cat of categories.rows) {
      const candidates = await pool.query(
        "SELECT name, photo_url, votes FROM candidates WHERE category_id = $1",
        [cat.id]
      );

      results.push({
        category: cat.name,
        candidates: candidates.rows,
      });
    }

    res.render("student/results", { results });
  } catch (error) {
    console.error("Error loading student results:", error);
    res.status(500).send("Error loading results");
  }
};
