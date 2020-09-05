/* Dependencies */
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require("./services/passport")();

/* Database */
const MONGODB_URI = process.env.MONGODB_URI;
const db = mongoose.connection;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db.on("open", () => {
  console.log("Mongo is Connected");
});

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

/* Controllers */

// =========================================== //
//    USER CONTROLLER => /users                //
// =========================================== //
//
// controls creates, updates, delete for User
// model. /user/signup creates & aauthenticate
// a new user, /users/login verifies authentic.
// credentials and returns the atuth user

app.use("/users", require("./controllers/users"));

/* Listener */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
