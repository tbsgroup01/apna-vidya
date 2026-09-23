const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required."),
  handleValidationErrors,
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password.")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirmation password do not match.");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  handleValidationErrors,
];

const validateResetPassword = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password.")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
};
