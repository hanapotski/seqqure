const router = require("express").Router();
const passport = require("../passport.settings");

// Controllers
const usersController = require("../controllers/users.controller");

// Filters
const validateBody = require("../filters/validate.body");
const validateSession = require("../filters/validate.session");
const validateResetPasswordToken = require("../filters/validate.resetpassword.token");

// Models
const Password = require("../models/resetPassword");

//Helpers
const hashPassword = require("../helpers/password.hasher");

module.exports = router;

router.get(
  "/forgotPassword/:token([0-9a-fA-F]{24})",
  validateResetPasswordToken,
  usersController.confirmUserBeforeResetPassword
);

router.put("/forgotPassword", usersController.forgotPassword);

router.put(
  "/resetPassword/:token([0-9a-fA-F]{24})",
  validateBody(Password),
  validateResetPasswordToken,
  hashPassword,
  usersController.resetPassword
);
