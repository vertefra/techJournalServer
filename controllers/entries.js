const express = require("express");
const { returnParams } = require("../services/utils");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Entry = require("../models/entry");

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
  console.log(user_id);
  Entry.findOne({ user_id }, (error, entry) => {
    entry
      ? res.status(200).json({ entries: entry })
      : res.status(404).json({ error: "Entry not found: " + error });
  });
});

// ======================================================== //
//    Add one entry => /users/:id/entries POST              //
// ======================================================== //
//
// Get the entries with id entry/:id for a user with id
// users/:id. user_id and entry_id are taken from the
// request with returnParams() function. For more info check
// returnParams in services/utils.js

router.post("/", (req, res) => {
  const user_id = returnParams(req)[0];
  req.body.id = uuidv4(); // generates a unique id
  console.log("Hitting Add one Entry route: ", req.body);
  Entry.updateOne(
    { user_id },
    {
      $push: { entries: req.body },
    },
    (error, updatedEntry) => {
      updatedEntry
        ? res.status(200).json(updatedEntry)
        : res
            .status(500)
            .json({ error: "could not update the entry: " + error });
    }
  );
});

module.exports = router;
