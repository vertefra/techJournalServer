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
//

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

// ======================================================== //
//    See all the events     => /users/:id/events           //
// ======================================================== //
//
// returns all the events associated with user
//
// OPTIONS:
//
//   ?events=eventsWillAttend => returns all the events the
//                               the user will attend
//
//   ?events=createdEvents => returns all the events created
//                                by the user
//
// eventsWillAttend is the default option
//

router.get("/", (req, res) => {
  user_id = returnParams(req);
  // set default if no option is avaiable
  // to show the events that the user will attend
  req.query.events = req.query.events ? req.query.events : "eventsWillAttend";
  console.log(req.query.events);
  User.findById(user_id, (error, foundUser) => {
    foundUser
      ? res.status(200).json(foundUser.createdEvents)
      : res.status(404).json({ error: "user or events not founded: " + error });
  })
    .populate(req.query.events)
    .select(req.query.events);
});

module.exports = router;
