const express = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { loginLimiter, passwordResetLimiter } = require("../middlewares/rateLimiter");
const {
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} = require("../middlewares/validator");

const router = express.Router();

router.post("/login", loginLimiter, validateLogin, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);
router.get("/profile", authenticate, authController.getMe);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/change-password", authenticate, validateChangePassword, authController.changePassword);
router.post("/forgot-password", passwordResetLimiter, validateForgotPassword, authController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, validateResetPassword, authController.resetPassword);
router.post("/register-admin", authController.registerAdmin);

module.exports = router;
