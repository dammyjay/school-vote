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
