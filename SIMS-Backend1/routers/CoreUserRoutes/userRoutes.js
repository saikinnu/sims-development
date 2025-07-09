const express = require("express");
const router = express.Router();
const {register,login,getProfile} =  require('../../controllers/CoreUserController/userController')
const { verifyToken, authorizeRoles } = require("../../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", verifyToken,getProfile);

// Example of role-based access control
// router.get("/admin-only", verifyToken, authorizeRoles("admin"), (req, res) => {
//   res.send("Hello Admin");
// });

module.exports = router;
