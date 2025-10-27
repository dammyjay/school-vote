// const pool = require("../Models/db");

// exports.vote = async (req, res) => {
//   const { candidate_id, category_id } = req.body;
//   const student = req.session.student;

//   if (!student) return res.redirect("/student/login");
//   const setting = await pool.query("SELECT * FROM settings LIMIT 1");
//   if (!setting.rows[0].voting_open) {
//     return res.send("Voting has been closed by the admin.");
//   }
//   const alreadyVoted = await pool.query(
//     "SELECT * FROM votes WHERE student_id=$1 AND category_id=$2",
//     [student.id, category_id]
//   );

//   if (alreadyVoted.rows.length > 0) {
//     return res.send("You already voted in this category.");
//   }

//   await pool.query(
//     "INSERT INTO votes (student_id, candidate_id, category_id) VALUES ($1, $2, $3)",
//     [student.id, candidate_id, category_id]
//   );

//   await pool.query("UPDATE candidates SET votes = votes + 1 WHERE id=$1", [
//     candidate_id,
//   ]);
//   await pool.query("UPDATE students SET has_voted=true WHERE id=$1", [
//     student.id,
//   ]);

//   res.send("Vote submitted successfully!");
// };



const pool = require("../Models/db");

exports.vote = async (req, res) => {
  const student = req.session.student;
  if (!student) return res.redirect("/student/login");

  try {
    // ✅ Check if voting is open
    const setting = await pool.query("SELECT * FROM settings LIMIT 1");
    if (!setting.rows[0] || !setting.rows[0].voting_open) {
      return res.send("Voting has been closed by the admin.");
    }

    // ✅ Get all category IDs
    const categoryIds = Array.isArray(req.body.category_ids)
      ? req.body.category_ids
      : [req.body.category_ids];

    // ✅ Loop through each category
    for (const category_id of categoryIds) {
      const candidate_id = req.body[`candidate_${category_id}`];

      // Skip if no selection
      if (!candidate_id) continue;

      // Check if student has voted in this category
      const alreadyVoted = await pool.query(
        "SELECT * FROM votes WHERE student_id=$1 AND category_id=$2",
        [student.id, category_id]
      );

      if (alreadyVoted.rows.length > 0) continue;

      // Record the vote
      await pool.query(
        "INSERT INTO votes (student_id, candidate_id, category_id) VALUES ($1, $2, $3)",
        [student.id, candidate_id, category_id]
      );

      // Update candidate vote count
      await pool.query("UPDATE candidates SET votes = votes + 1 WHERE id=$1", [
        candidate_id,
      ]);
    }

    // ✅ Mark student as voted
    await pool.query("UPDATE students SET has_voted=true WHERE id=$1", [
      student.id,
    ]);

    // ✅ Refresh session data
    req.session.student.has_voted = true;

    // Redirect or show success message
    res.send("✅ Your votes have been submitted successfully!");
  } catch (error) {
    console.error("Error submitting votes:", error);
    res.status(500).send("An error occurred while submitting your votes.");
  }
};
