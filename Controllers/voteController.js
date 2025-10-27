const pool = require("../Models/db");

exports.vote = async (req, res) => {
  const { candidate_id, category_id } = req.body;
  const student = req.session.student;

  if (!student) return res.redirect("/student/login");
 const setting = await pool.query("SELECT * FROM settings LIMIT 1");
 if (!setting.rows[0].voting_open) {
   return res.send("Voting has been closed by the admin.");
 }
  const alreadyVoted = await pool.query(
    "SELECT * FROM votes WHERE student_id=$1 AND category_id=$2",
    [student.id, category_id]
  );

  if (alreadyVoted.rows.length > 0) {
    return res.send("You already voted in this category.");
  }

  await pool.query(
    "INSERT INTO votes (student_id, candidate_id, category_id) VALUES ($1, $2, $3)",
    [student.id, candidate_id, category_id]
  );

  await pool.query("UPDATE candidates SET votes = votes + 1 WHERE id=$1", [
    candidate_id,
  ]);
  await pool.query("UPDATE students SET has_voted=true WHERE id=$1", [
    student.id,
  ]);

  res.send("Vote submitted successfully!");
};
