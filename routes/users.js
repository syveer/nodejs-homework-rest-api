const express = require("express");
const auth = require("../midlleware/auth");
const {
  logout,
  getCurrent,
  updateSubscription,
} = require("../controller/userController");

const router = express.Router();

// Ruta pentru deconectarea utilizatorului
router.get("/logout", auth, async (req, res) => {
  try {
    await logout(req, res);
    res.status(204).send();
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Ruta pentru obținerea datelor utilizatorului curent
router.get("/current", auth, async (req, res) => {
  try {
    const userData = await getCurrent(req, res);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error getting current user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Ruta pentru actualizarea abonamentului utilizatorului
router.patch("/", auth, async (req, res) => {
  try {
    const updatedUser = await updateSubscription(
      req.user._id,
      req.body.subscription
    );
    res.status(200).json({
      message: "Subscription updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
