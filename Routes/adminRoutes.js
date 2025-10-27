

// const express = require("express");
// const router = express.Router();
// const adminController = require("../Controllers/adminController");
// const adminAuth = require("../Middleware/adminAuth");

// // Login
// router.get("/login", adminController.adminLoginPage);
// router.post("/login", adminController.adminLogin);

// // Dashboard (protected)
// router.get("/dashboard", adminAuth, (req, res) => {
//   res.render("admin/dashboard");
// });

// // Register Student (protected)
// router.get("/register-student", adminAuth, (req, res) => {
//   res.render("admin/registerStudent");
// });
// router.post("/register-student", adminAuth, adminController.registerStudent);

// // Create Category (protected)
// router.get("/create-category", adminAuth, adminController.getCategories);

// router.post("/create-category", adminAuth, adminController.createCategory);
// router.post("/edit-category/:id", adminAuth, adminController.editCategory);

// router.get(
//   "/create-category/:id/candidates",
//   adminAuth,
//   adminController.getCandidates
// );


// // Logout
// router.get("/logout", adminAuth, adminController.adminLogout);

// module.exports = router;
 


const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const adminAuth = require("../Middleware/adminAuth");

// Login
router.get("/login", adminController.adminLoginPage);
router.post("/login", adminController.adminLogin);

// Dashboard (protected)
router.get("/dashboard", adminAuth, (req, res) => {
  res.render("admin/dashboard");
});

// Register Student (protected)
router.get("/register-student", adminAuth, adminController.getRegisterStudentPage);
router.post("/register-student", adminAuth, adminController.registerStudent);



// 🟢 Category CRUD (protected)
router.get("/create-category", adminAuth, adminController.getCategories);
router.post("/create-category", adminAuth, adminController.createCategory);
router.post("/edit-category/:id", adminAuth, adminController.editCategory);
router.get("/delete-category/:id", adminAuth, adminController.deleteCategory);

// 🟣 Candidate Routes (protected)
router.get(
  "/create-category/:id/candidates",
  adminAuth,
  adminController.getCandidates
);router.get(
  "/create-category/:id/candidates",
  adminAuth,
  adminController.getCandidates
);
router.post(
  "/add-candidate",
  adminAuth,
  adminController.upload.single("photo"), // use Multer
  adminController.addCandidate
);

router.post(
  "/add-multiple-candidates",
  adminAuth,
  adminController.upload.array("photo"), // expects "photo"
  adminController.addMultipleCandidates
);

router.post(
  "/edit-candidate/:id",
  adminAuth,
  adminController.upload.single("photo"),
  adminController.editCandidate
);
router.get(
  "/delete-candidate/:id/:category_id",
  adminAuth,
  adminController.deleteCandidate
);

// Results page route
router.get("/results", adminController.viewResults);

// Logout
router.get("/logout", adminAuth, adminController.adminLogout);

router.post("/toggle-voting", adminController.toggleVoting);


module.exports = router;
