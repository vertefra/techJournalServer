const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const passport = require("../services/passport");
const config = require("../services/config");
const User = require("../models/user");
const { addEntryRef, event_filtered_id } = require("../services/utils");
const Entry = require("../models/entry");
// const { skills_filtered_id } = require("../services/utils");
// const { events_filtered_id } = require("../services/utils");

router.post("/signup", (req, res) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (req.body.email.match(emailRegex) && req.body.password) {
    // Hash the password:
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    User.findOne({ email: req.body.email }, (error, user) => {
      console.log("========findOne=======", user);
      if (!user) {
        console.log("Running create user");
        console.log(req.body);
        User.create(req.body, (error, createdUser) => {
          if (createdUser) {
            addEntryRef(createdUser._id, (error, updatedUser) => {
              if (updatedUser) {
                const payload = {
                  id: createdUser.id,
                };
                let token = jwt.encode(payload, config.jwtSecret);
                res.status(200).json({ token: token, user: createdUser });
              } else {
                res.status(500).json({
                  error: "failed to create reference from entryes to user: ",
                  error,
                });
              }
            });
          } else {
            res.status(401).json({ error: "failed to create user: " + error });
          }
        });
      } else {
        res.status(401).json({
          error: "User already exists, try logging in instead: " + error,
        });
      }
    });
  } else {
    res
      .status(401)
      .json({ error: "mail format not correct or empty fields found" });
  }
});
//User sign-in route
router.post("/login", (req, res) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (req.body.email.match(emailRegex) && req.body.password) {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }, (error, user) => {
      if (user) {
        console.log("Found user. Checking password...");
        if (bcrypt.compareSync(req.body.password, user.password)) {
          console.log("Password correct, generating JWT...");
          let payload = {
            id: user.id,
          };
          let token = jwt.encode(payload, config.jwtSecret);
          console.log(token);
          user.password = undefined; // erasing password
          res.json({ token: token, user: user }); // sending also the user data with the token to client
        } else {
          res.status(401).json({ error: "Wrong password" });
        }
      } else {
        console.log("Couldn't find user. Try signing up.");
        res.status(401).json({ error: "couldn't find the user" });
      }
    });
  } else {
    res
      .status(401)
      .json({ error: "mail format not correct or empty fields found" });
  }
});

// =========================================== //
//    Get all the users => /users GET          //
// =========================================== //

router.get("/", (req, res) => {
  User.find({}, (error, allUsers) => {
    allUsers
      ? res.status(200).json(allUsers)
      : res.status(404).json({ error: "Users not found: " + error });
  }).select("-password"); // this is to not send the password to the client
});

// =========================================== //
//    Get one user  => /users/:id GET          //
// =========================================== //

router.get("/:id", (req, res) => {
  User.findById(req.params.id, (error, user) => {
    user
      ? res.status(200).json(user)
      : res.status(404).json({ error: "User not found: " + error });
  })
    .select("-password")
    .populate(req.query.populate);
});

// =========================================== //
//    Create one user  => /users POST          //
// =========================================== //

router.post("/", (req, res) => {
  console.log("Hitting users routes");
  User.create(req.body, (error, createdUser) => {
    console.log(createdUser);
    createdUser
      ? res.status(200).json(createdUser)
      : res.status(500).json({ error: "failed creating a new user: " + error });
  });
});

// =========================================== //
//    Update one user  => /users/:id PUT       //
// =========================================== //

router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    (error, updatedUser) => {
      updatedUser
        ? res.status(200).json(updatedUser)
        : res.status(500).json({ error: "Failed updating user: " + error });
    }
  );
});

// =========================================== //
//    Delete one user  => /users/:id DELETE    //
// =========================================== //
//
// Once the user is found it looks also for the
// entry with the user_id equal to the _id of
// the deleted user and romoves it

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (error, deletedUser) => {
    if (deletedUser) {
      Entry.findByIdAndDelete(
        deletedUser.journalEntries,
        (error, deletedEntries) => {
          deletedEntries
            ? res.status(200).json({
                message:
                  "user and entries deleted succesfully: " + deletedEntries,
              })
            : res.status(404).json({
                error:
                  "User deleted, but something prevent from deleting the entries " +
                  error,
              });
        }
      );
    } else {
      res.status(500).json({ error: "failed deleting the user " + error });
    }
  });
});

module.exports = router;
