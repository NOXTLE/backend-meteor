const express = require("express");
const { register, login, allUser } = require("../controller/userControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(register).get(protect, allUser);
router.route("/login").post(login);

module.exports = router;
