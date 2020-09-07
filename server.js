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
// Controls: creates, updates, delete for User
// model. /user/signup creates & aauthenticate
// a new user, /users/login verifies authentic.
// credentials and returns the auth user

app.use("/users", require("./controllers/users"));

// =========================================== //
//    ENTRIES CONTROLLER => /users/:id/entries //
// =========================================== //
//
// Controls: create, udates, delete for entries
// belonging to /users/:id.

app.use("/users/:id/entries", require("./controllers/usersEntries"));

// =========================================== //
//    SKILLS CONTROLLER => /skills             //
// =========================================== //
//
// Controls: create, updates, delete for a
// general skills database. User database will
// reference it creating a one-to-many relation

app.use("/skills", require("./controllers/skills"));

// =========================================== //
//   SKILLS CTRL ON USER => /users/:id/skills  //
// =========================================== //
//
// Controls: create, updates, delete for a
// skills for a user with id = :id

app.use("/users/:id/skills", require("./controllers/usersSkills"));

// =========================================== //
//   EVENTS CONTROLLER => /users/:id/events    //
// =========================================== //
//
// Controls: create, updates, delete for
// events

app.use("/users/:id/events", require("./controllers/usersEvents"));

/* End Controllers */

/* Listener */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
