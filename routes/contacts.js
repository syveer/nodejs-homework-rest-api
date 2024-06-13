const express = require("express");
const { STATUS_CODES } = require("../utiles/constants.js");
const AuthController = require("../controller/authController.js");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../controller/contactsController.js");

const router = express.Router();

router.get("/", AuthController.validateAuth, async (req, res, next) => {
  const { page = 1, limit = 5, favorite } = req.query;

  try {
    const favoriteFilter =
      favorite !== undefined ? favorite === "true" : undefined;

    const contactsData = await listContacts(
      Number(page),
      Number(limit),
      favoriteFilter
    );

    console.log("--- List Contacts ---");
    res.status(STATUS_CODES.success).json({
      message: "Contacts retrieved successfully",
      data: contactsData.contacts,
      totalContacts: contactsData.totalContacts,
      totalPages: contactsData.totalPages,
      currentPage: contactsData.currentPage,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(STATUS_CODES.serverError).json({ message: "Server error" });
  }
});

router.get(
  "/:contactId",
  AuthController.validateAuth,
  async (req, res, next) => {
    try {
      const contact = await getContactById(req.params.contactId);

      if (!contact) {
        return res
          .status(STATUS_CODES.notFound)
          .json({ message: "Contact not found" });
      }

      console.log(`--- Get Contact ${req.params.contactId} ---`);
      res.status(STATUS_CODES.success).json({
        message: "Contact retrieved successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Error fetching contact:", error.message);
      res.status(STATUS_CODES.serverError).json({ message: "Server error" });
    }
  }
);

router.post("/", AuthController.validateAuth, async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const newContact = await addContact({ name, email, phone });

    console.log("--- Add Contact ---");
    res.status(STATUS_CODES.created).json(newContact);
  } catch (error) {
    console.error("Error adding contact:", error.message);
    res.status(STATUS_CODES.serverError).json({ message: "Server error" });
  }
});

router.delete(
  "/:contactId",
  AuthController.validateAuth,
  async (req, res, next) => {
    try {
      const contactId = req.params.contactId;
      const removedContact = await removeContact(contactId);

      if (!removedContact) {
        return res
          .status(STATUS_CODES.notFound)
          .json({ message: "Contact not found" });
      }

      console.log(`--- Remove Contact ${contactId} ---`);
      res
        .status(STATUS_CODES.deleted)
        .json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error removing contact:", error.message);
      res.status(STATUS_CODES.serverError).json({ message: "Server error" });
    }
  }
);

router.put(
  "/:contactId",
  AuthController.validateAuth,
  async (req, res, next) => {
    const contactId = req.params.contactId;
    try {
      const updatedContact = await updateContact(req.body, contactId);

      if (!updatedContact) {
        return res
          .status(STATUS_CODES.notFound)
          .json({ message: "Contact not found" });
      }

      console.log(`--- Update Contact ${contactId} ---`);
      res.status(STATUS_CODES.success).json(updatedContact);
    } catch (error) {
      console.error("Error updating contact:", error.message);
      res.status(STATUS_CODES.serverError).json({ message: "Server error" });
    }
  }
);

router.patch(
  "/:contactId/favorite",
  AuthController.validateAuth,
  async (req, res) => {
    const contactId = req.params.contactId;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res
        .status(STATUS_CODES.badRequest)
        .json({ message: "Missing field 'favorite'" });
    }
    try {
      const updatedContact = await updateStatusContact(contactId, { favorite });

      if (!updatedContact) {
        return res
          .status(STATUS_CODES.notFound)
          .json({ message: "Contact not found" });
      }

      console.log(`--- Update Contact ${contactId} Favorite ---`);
      res.status(STATUS_CODES.success).json(updatedContact);
    } catch (error) {
      console.error("Error updating contact favorite status:", error.message);
      res.status(STATUS_CODES.serverError).json({ message: "Server error" });
    }
  }
);

module.exports = router;
