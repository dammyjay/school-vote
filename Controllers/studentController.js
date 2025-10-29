const pool = require("../Models/db");


// exports.login = async (req, res) => {
//   const { firstname, lastname, voting_id } = req.body;

//   const result = await pool.query(
//     `SELECT * FROM students 
//      WHERE LOWER(firstname) = LOWER($1) 
//        AND LOWER(lastname) = LOWER($2) 
//        AND voting_id = $3`,
//     [firstname, lastname, voting_id]
//   );

//   if (result.rows.length > 0) {
//     req.session.student = result.rows[0];
//     res.redirect("/vote");
//   } else {
//     // Show alert and go back to the login page
//     res.send(`
//       <script>
//         alert("Invalid credentials. Please check your name and voting ID.");
//         window.location.href = "/"; // redirect back to your login page
//       </script>
//     `);
//   }
// };



// Show voting results to students

exports.login = async (req, res) => {
  let { firstname, lastname, voting_id } = req.body;

  // Clean the input
  firstname = firstname.trim().replace(/\s+/g, " ");
  lastname = lastname.trim().replace(/\s+/g, " ");

  const result = await pool.query(
    `SELECT * FROM students 
     WHERE REPLACE(LOWER(firstname), ' ', '') = REPLACE(LOWER($1), ' ', '')
       AND REPLACE(LOWER(lastname), ' ', '') = REPLACE(LOWER($2), ' ', '')
       AND voting_id = $3`,
    [firstname, lastname, voting_id]
  );

  if (result.rows.length > 0) {
    req.session.student = result.rows[0];
    res.redirect("/vote");
  } else {
    res.send(`
      <script>
        alert("Invalid credentials. Please check your name and voting ID.");
        window.location.href = "/"; 
      </script>
    `);
  }
};

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
    // res.status(500).send("Error loading results");
    // Show popup alert and redirect back
    res.send(`
      <script>
        alert("An error occurred while loading the results. Please try again later.");
        window.location.href = "/vote"; // or "/" depending on where you want to redirect
      </script>
    `);
  }
};
