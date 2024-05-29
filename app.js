const express = require("express");
const dbConnection = require("./utils/dbConnection");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const contactRoutes = require("./routes/contacts");

const app = express();
app.use(express.json());

app.use("/users", authRoutes);
app.use("/users", userRoutes);
app.use("/contacts", contactRoutes);

dbConnection();

module.exports = app;
