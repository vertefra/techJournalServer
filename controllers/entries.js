const express = require("express");
const { returnParams } = require("../services/utils");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Entry = require("../models/entry");
const { update } = require("../models/entry");

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
      ? res.status(200).json({ entries: entry.entries })
      : res.status(404).json({ error: "Entry not found: " + error });
  });
});

// ======================================================== //
//    Add one entry => /users/:id/entries POST              //
// ======================================================== //
//
// Add one entry from req.body to Entry model associated
// with user_id === :id

router.post("/", (req, res) => {
  const user_id = returnParams(req)[0];
  // req.body.id = uuidv4(); // generates a unique id
  Entry.updateOne(
    { user_id },
    {
      $push: { entries: req.body },
    },
    (error, updatedEntry) => {
      updatedEntry
        ? res.status(200).json({ newEntry: req.body, result: updatedEntry })
        : res
            .status(500)
            .json({ error: "Could not update the entry: " + error });
    }
  );
});

// ======================================================== //
//    delete one entry => /users/:id/entries/:id DELETE     //
// ======================================================== //
//
// Remove the entry with id === entries/:id from the Entry
// document associated with the user === users/:id

router.delete("/:id", (req, res) => {
  const [user_id, entry_id] = returnParams(req);
  Entry.updateOne(
    { user_id },
    {
      $pull: { entries: { _id: entry_id } },
    },
    (error, updatedEntry) => {
      updatedEntry
        ? res.status(200).json({ deletedEntry: true, result: updatedEntry })
        : res
            .status(500)
            .json({ error: "Could not delete the entry: " + error });
    }
  );
});

// ======================================================== //
//    update one entry => /users/:id/entries/:id PUT        //
// ======================================================== //
//
// Updates the entry with id === entries/:id from the Entry
// document associated with the user === users/:id

router.put("/:id", (req, res) => {
  const [user_id, entry_id] = returnParams(req);
  console.log(req.body);
  Entry.updateOne(
    { user_id, "entries._id": entry_id },
    {
      $set: {
        "entries.$.title": req.body.title,
        "entries.$.content": req.body.content,
      },
    },
    (error, updatedEntry) => {
      updatedEntry
        ? res.status(200).json({ updatedEntry: true, result: updatedEntry })
        : res
            .status(500)
            .json({ error: "Could not update the entry: " + error });
    }
  );
});
module.exports = router;
