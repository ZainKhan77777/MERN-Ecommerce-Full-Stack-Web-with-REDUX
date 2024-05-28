const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout, forgetPassword, resetPassword, getUserDetail, updatePassword} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser ,getUserDetail);
router.route("/password/update").put(isAuthenticatedUser , updatePassword);
module.exports = router;