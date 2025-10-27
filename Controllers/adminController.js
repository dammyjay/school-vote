


const pool = require("../Models/db");
const generateVotingID = require("../Utils/generateID");
const cloudinary = require("../Utils/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 🖼 Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "school_voting_candidates",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
exports.upload = upload; // Export so route can use it

// 🧍 Register Student
// exports.registerStudent = async (req, res) => {
//   try {
//     const { firstname, lastname } = req.body;
//     const voting_id = generateVotingID();

//     await pool.query(
//       "INSERT INTO students (firstname, lastname, voting_id) VALUES ($1, $2, $3)",
//       [firstname, lastname, voting_id]
//     );

//     // ✅ Redirect back to show the updated list
//     res.redirect("/admin/register-student");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error registering student");
//   }
// };

exports.registerStudent = async (req, res) => {
  try {
    let { firstname, lastname } = req.body;

    // Ensure they are arrays (if only one student, make it an array)
    if (!Array.isArray(firstname)) firstname = [firstname];
    if (!Array.isArray(lastname)) lastname = [lastname];

    for (let i = 0; i < firstname.length; i++) {
      const voting_id = generateVotingID();
      await pool.query(
        "INSERT INTO students (firstname, lastname, voting_id) VALUES ($1, $2, $3)",
        [firstname[i], lastname[i], voting_id]
      );
    }

    res.redirect("/admin/register-student");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering students");
  }
};


exports.getRegisterStudentPage = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
    res.render("admin/registerStudent", { students: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// 🟢 Create Category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO categories (name) VALUES ($1)", [name]);
  res.redirect("/admin/create-category");
};

// 🔵 Read Categories
exports.getCategories = async (req, res) => {
  const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
  res.render("admin/createCategory", { categories: result.rows });
};

// 🟡 Edit Category
exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await pool.query("UPDATE categories SET name=$1 WHERE id=$2", [name, id]);
  res.redirect("/admin/create-category");
};

// 🔴 Delete Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM categories WHERE id=$1", [id]);
  res.redirect("/admin/create-category");
};

exports.addCandidate = async (req, res) => {
  const { name, category_id } = req.body;
  const photo_url = req.file ? req.file.path : null; // Cloudinary file URL

  try {
    await pool.query(
      "INSERT INTO candidates (name, photo_url, category_id) VALUES ($1, $2, $3)",
      [name, photo_url, category_id]
    );
    res.redirect(`/admin/create-category/${category_id}/candidates`);
  } catch (err) {
    console.error(err);
    res.send("Error uploading candidate");
  }
};

exports.addMultipleCandidates = async (req, res) => {
  try {
    const { category_id, name } = req.body;
    const files = req.files;

    const names = Array.isArray(name) ? name : [name];

    for (let i = 0; i < names.length; i++) {
      const photo_url = files[i]?.path;

      await pool.query(
        "INSERT INTO candidates (name, photo_url, category_id) VALUES ($1, $2, $3)",
        [names[i], photo_url, category_id]
      );
    }

    res.redirect(`/admin/create-category/${category_id}/candidates`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding multiple candidates");
  }
};




// 🟠 View Candidates in a Category
exports.getCandidates = async (req, res) => {
  const { id } = req.params;
  const category = await pool.query("SELECT * FROM categories WHERE id=$1", [
    id,
  ]);
  const candidates = await pool.query(
    "SELECT * FROM candidates WHERE category_id=$1",
    [id]
  );
  res.render("admin/candidates", {
    category: category.rows[0],
    candidates: candidates.rows,
  });
};


// 🟡 Edit Candidate (update name or photo)
exports.editCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, category_id } = req.body;
  const photo_url = req.file ? req.file.path : req.body.existing_photo; // keep old if not changed

  try {
    await pool.query(
      "UPDATE candidates SET name=$1, photo_url=$2 WHERE id=$3",
      [name, photo_url, id]
    );
    res.redirect(`/admin/create-category/${category_id}/candidates`);
  } catch (err) {
    console.error(err);
    res.send("Error updating candidate");
  }
};

// 🔴 Delete Candidate
exports.deleteCandidate = async (req, res) => {
  const { id, category_id } = req.params;

  try {
    await pool.query("DELETE FROM candidates WHERE id=$1", [id]);
    res.redirect(`/admin/create-category/${category_id}/candidates`);
  } catch (err) {
    console.error(err);
    res.send("Error deleting candidate");
  }
};

// 🧩 Admin Login/Logout
exports.adminLoginPage = (req, res) => {
  res.render("admin/login", { message: null });
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM admin WHERE username=$1 AND password=$2",
      [username, password]
    );

    if (result.rows.length > 0) {
      req.session.admin = result.rows[0];
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/login", { message: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.send("Error logging in");
  }
};

exports.adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};
