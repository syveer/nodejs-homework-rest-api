const Contact = require("../models/contact");
const colors = require("colors");

const listContacts = async (page = 1, limit = 5, favorite) => {
  try {
    console.log(colors.bgYellow.italic.bold("--- List Contacts: ---"));

    const skip = (page - 1) * limit;
    const filter = favorite !== undefined ? { favorite } : {};

    const contacts = await Contact.find(filter).skip(skip).limit(limit);
    const totalContacts = await Contact.countDocuments(filter);

    return {
      contacts,
      totalContacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error listing contacts: ${error.message}`);
  }
};

const getContactById = async (contactId) => {
  try {
    console.log(
      colors.bgYellow.italic.bold(`--- Get Contact with id ${contactId}: ---`)
    );
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error getting contact by id: ${error.message}`);
  }
};

const removeContact = async (contactId) => {
  try {
    console.log(
      colors.bgYellow.italic.bold(
        `--- Delete Contact with id ${contactId}: ---`
      )
    );
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error removing contact: ${error.message}`);
  }
};

const addContact = async (contact) => {
  try {
    console.log(colors.bgYellow.italic.bold("--- New Contact Created: ---"));
    return await Contact.create(contact);
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error adding contact: ${error.message}`);
  }
};

const updateContact = async (updatedContact, contactId) => {
  try {
    console.log(
      colors.bgYellow.italic.bold(
        `--- Update Contact with id ${contactId}: ---`
      )
    );
    const updatedDoc = await Contact.findByIdAndUpdate(
      contactId,
      updatedContact,
      { new: true }
    );
    if (!updatedDoc) {
      throw new Error("Contact not found");
    }
    return updatedDoc;
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error updating contact: ${error.message}`);
  }
};

const updateStatusContact = async (contactId, updatedStatus) => {
  try {
    console.log(
      colors.bgYellow.italic.bold(
        `--- Change Status for Contact with id ${contactId}: --- `
      )
    );
    const updatedDoc = await Contact.findByIdAndUpdate(
      contactId,
      updatedStatus,
      { new: true }
    );
    if (!updatedDoc) {
      throw new Error("Contact not found");
    }
    return updatedDoc;
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    throw new Error(`Error updating contact status: ${error.message}`);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
