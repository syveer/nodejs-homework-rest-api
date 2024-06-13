const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dbConnection = require("./utiles/dbConnection");
const passport = require("./passport");
const { STATUS_CODES } = require("./utiles/constants");

const contactsRouter = require("./routes/contacts");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Conectarea la baza de date
dbConnection();

// Middleware
app.use(express.static("public"));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rute
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use(
  "/contacts",
  passport.authenticate("jwt", { session: false }),
  contactsRouter
);

// Ruta pentru gestionarea erorilor 404
app.use((req, res) => {
  res.status(STATUS_CODES.notFound).json({ message: "Not found" });
});

// Middleware pentru gestionarea erorilor
app.use((err, req, res, next) => {
  console.error(err.stack); // Înregistrează stack trace-ul erorii
  res.status(STATUS_CODES.error).json({ message: "Server error" });
});

module.exports = app;
