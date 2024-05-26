const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const authController = require("../controllers/authController");
const {rateLimiter} = require("../controllers/rateLimiter");

router
  .route("/login")
  .get(authController.handleLogin)
  .post(validateForm, rateLimiter(60, 10), authController.attemptLogin)

router
  .post("/signup", validateForm, rateLimiter(30, 4), authController.attemptRegister);

module.exports = router;

