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
  console.log("event after parsing", event);
  if (event.error) {
    res.status(400).json({ error: event });
  } else {
    Event.create(req.body, (error, createdEvent) => {
      console.log(createdEvent);
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
        console.log(error);
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
    console.log(foundUser);
    foundUser
      ? res.status(200).json(foundUser[req.query.events])
      : res.status(404).json({ error: "user or events not founded: " + error });
  })
    .populate(req.query.events)
    .select(req.query.events);
});

// ======================================================== //
//    Returns one event      => /users/:id/events/:id  GET  //
// ======================================================== //
//
// OPTIONS:
//
//   ?events=eventsWillAttend => search the event in
//                               eventsWillAttend
//
//   ?events=createdEvents => search the event in
//                            createdEvents
//
// if no option is available searches the events in both the
// field.
//

router.get("/:id", (req, res) => {
  const [user_id, event_id] = returnParams(req);
  req.query.events = req.query.events
    ? req.query.events
    : "eventsWillAttend createdEvents";
  User.findById(user_id, (error, foundEvents) => {
    if (foundEvents) {
      foundEvents.eventsWillAttend = foundEvents.eventsWillAttend
        ? foundEvents.eventsWillAttend
        : [];
      foundEvents.createdEvents = foundEvents.createdEvents
        ? foundEvents.createdEvents
        : [];
      const events = [
        ...foundEvents.eventsWillAttend,
        ...foundEvents.createdEvents,
      ];
      console.log(events);
      const event = events.find((evt) => {
        return evt._id.toString() === event_id.toString();
      });
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Could not find the user: ", error });
    }
  })
    .populate(req.query.events)
    .select(req.query.events);
});

// ==================================================================== //
//    Add one event to eventsWillAttend => /users/:id/events/:id  POST  //
// ==================================================================== //
//
//  add an event with id events/:id to the eventsWillAttend array of
//  the user with id users/:id

router.post("/:id", (req, res) => {
  const [user_id, post_id] = returnParams(req);
  console.log(post_id);
  User.findByIdAndUpdate(
    user_id,
    {
      $push: { eventsWillAttend: post_id },
    },
    (error, updatedUser) => {
      updatedUser
        ? res.status(200).json(updatedUser)
        : res.status(404).json({
            error: "cannot update user. is this a duplicated event? :" + error,
          });
    }
  );
});

// =========================================================================== //
//    Remove one event from eventsWillAttend => /users/:id/events/:id  DELETE  //
// =========================================================================== //
//
//  Remove an event with id events/:id from the eventsWillAttend array of
//  the user with id users/:id

router.delete("/:id", (req, res) => {
  const [user_id, post_id] = returnParams(req);
  User.findByIdAndUpdate(
    user_id,
    {
      $pull: { eventsWillAttend: post_id },
    },
    (error, updatedUser) => {
      updatedUser
        ? res.status(200).json(updatedUser)
        : res.status(404).json({
            error: "cannot delete user:" + error,
          });
    }
  );
});

module.exports = router;
