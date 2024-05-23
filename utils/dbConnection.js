const mongoose = require("mongoose");
const colors = require("colors");

async function dbConnection() {
  try {
    await mongoose.connect(
      "mongodb+srv://syveer:Restanta20@db-contacts.tklmrhn.mongodb.net"
    );
    console.log(colors.bgGreen.italic.bold("Database connection successful!"));
  } catch (error) {
    console.error(colors.bgRed.italic.bold(error));
    process.exit(1);
  }
}

module.exports = dbConnection;
