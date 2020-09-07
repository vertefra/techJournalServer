const express = require("express");
const router = express.Router();
const { parseEventObject, returnParams } = require("../services/utils");
const Event = require("../models/event");
const User = require("../models/user");

// ======================================================== //
//    Create a new Event => /users/:id/events POST          //
// ======================================================== //
//
// creates a new event associated with user with id users/:id
// Add the reference of the event to the field createdEvents
// for user users/:id

router.post("/", (req, res) => {
  user_id = returnParams(req)[0];
  req.body.owner_id = user_id;
  const event = parseEventObject(req.body);
  if (event.error) {
    res.status(400).json({ error: event });
  } else {
    Event.create(req.body, (error, createdEvent) => {
      if (createdEvent) {
        // find the user and add the event to the list of createdEvents
        User.findByIdAndUpdate(
          user_id,
          {
            $push: { createdEvents: createdEvent._id },
          },
          (error, updatedUser) => {
            updatedUser
              ? res.status(200).json({
                  message:
                    "event created and added to user createdEvents: " +
                    updatedUser,
                })
              : res.status(500).json({
                  error:
                    "failed in adding the event reference to the user " + error,
                });
          }
        );
      } else {
        res
          .status(500)
          .json({ error: "failed in creating a new event: ", error });
      }
    });
  }
});

module.exports = router;
