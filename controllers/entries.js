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
// Get all the entries for a user with id === :id.
// Id from user is taken from the url string with
// returnParams function. For more info check
// returnParams in services/utils.js

router.get("/", (req, res) => {
  const id = returnParams(req)[0];
  console.log(id);
  User.findById(id);
});
module.exports = router;
