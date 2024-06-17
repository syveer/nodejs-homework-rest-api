const express = require("express");
const auth = require("../midlleware/auth");
const {
  logout,
  getCurrent,
  updateSubscription,
} = require("../controller/userController");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const sendVerificationEmail = require("../emailService");

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

// Ruta pentru înregistrarea unui utilizator nou și trimiterea emailului de verificare
router.post("/register", async (req, res) => {
  const { email, password, subscription } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Missing required fields: email and password" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const verificationToken = uuidv4();
    const newUser = new User({
      email,
      password,
      subscription,
      verificationToken,
    });
    newUser.setPassword(password);

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);
    return res
      .status(201)
      .json({ message: "User registered. Verification email sent" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta pentru trimiterea emailului de verificare
router.post("/verify", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing required field: email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail(email, user.verificationToken);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta pentru verificarea token-ului de verificare a emailului
router.get("/verify/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
