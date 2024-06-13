const { respondWithError } = require("./respondWithError");
const { STATUS_CODES } = require("./constants");

// Exemplu de utilizare în alt modul
function processRequest(req, res) {
  try {
    // ... procesare cerere
    throw new Error("Something went wrong");
  } catch (error) {
    respondWithError(res, error);
  }
}
