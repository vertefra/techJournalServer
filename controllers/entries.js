const express = require("express");
const { returnParams } = require("../services/utils");
const router = express.Router();
// const User = require('../models/user')

router.get("/:id", (req, res) => {
  console.log(returnParams(req));
  res.json({ success: true });
});

// ======================================================== //
//    Get all entries => /users/:id/entries GET             //
// ======================================================== //
//
// Get all the entries for a user with id users/:id.
// usre_id is taken from the request with returnParams()
// function. For more info check returnParams()
// in services/utils.js

router.get("/", (req, res) => {
  const user_id = returnParams(req)[0];
  Entry.findOne({ user_id }, (error, entry) => {
    entry
      ? res.status(200).json({ entries: entry.entries })
      : res.status(404).json({ error: "Entry not found: " + error });
  });
});

// ======================================================== //
//    Get one entry => /users/:id/entries/:id               //
// ======================================================== //
//
// Get the entries with id entry/:id for a user with id
// users/:id. user_id and entry_id are taken from the
// request with returnParams() function. For more info check
// returnParams in services/utils.js

router.get("/:id", (req, res) => {
  const [user_id, entry_id] = returnParams(req);
  Entry.findOne({ user_id });
});

module.exports = router;
