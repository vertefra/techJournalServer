const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const passport = require("../services/passport");
const config = require("../services/config");
// const User = require('../models/user')

router.post("/signup", (req, res) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (req.body.email.match(emailRegex) && req.body.password) {
    // Hash the password:
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    User.findOne({ email: req.body.email }, (user) => {
      console.log("========findOne=======", user);
      if (!user) {
        console.log("Running create user");
        User.create(req.body, (error, createdUser) => {
          if (createdUser) {
            const payload = {
              id: createdUser.id,
            };
            let token = jwt.encode(payload, config.jwtSecret);
            createdUser.password = undefined; // erasing password before sending to client
            res.status(200).json({ token: token, user: createdUser }); // if create a new user send also all the info for the user
          } else {
            res.status(401).json({ error: "failed to create user" });
          }
        });
      } else {
        res
          .status(401)
          .json({ error: "User already exists, try logging in instead" });
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
          user.password = undefined; // erasing the password before to send it to client
          res.json({ token: token, user: user }); // sending also the user data with the token to client
        } else {
          res.sendStatus(401).json({ error: "Wrong password" });
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
  }).select("-password");
});

// =========================================== //
//    Create one user  => /users POST          //
// =========================================== //

router.post("/", (req, res) => {
  User.create(req.body, (error, createdUser) => {
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

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (error, deletedUser) => {
    deletedUser
      ? res.status(200).json(deletedUser)
      : res.status(500).json({ error: "failed deleting the user " + error });
  });
});

module.exports = router;
