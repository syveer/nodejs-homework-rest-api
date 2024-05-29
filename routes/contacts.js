const express = require("express");
const auth = require("../midlleware/auth");
const Contact = require("../models/contacts");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const query = { owner: req.user._id };
    if (favorite !== undefined) {
      query.favorite = favorite === "true";
    }

    const contacts = await Contact.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const newContact = new Contact({
      ...req.body,
      owner: req.user._id,
    });

    await newContact.save();

    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
