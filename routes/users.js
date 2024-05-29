const express = require("express");
const auth = require("../midlleware/auth");
const {
  logout,
  getCurrent,
  updateSubscription,
} = require("../controller/userController");

const router = express.Router();

router.get("/logout", auth, logout);
router.get("/current", auth, getCurrent);
router.patch("/", auth, updateSubscription);

module.exports = router;
