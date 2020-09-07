const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { paginate, parseEventObject } = require("../services/utils");
const e = require("express");

// =========================================== //
//    Get all the Event => /events GET         //
// =========================================== //

router.get("/", (req, res) => {
  Event.find({}, (error, allEvents) => {
    if (allEvents) {
      const page = req.query.page;
      const display = req.query.display;
      const events = paginate(allEvents, page, display);
      res.status(200).json(events);
    } else {
      res
        .status(500)
        .json({ error: "something happened and I can't proceed: " + error });
    }
  });
});

// ================================================ //
//    Update an Event => /events/:id?user_id=id PUT //
// ================================================ //

// needs to be tested

router.put("/:id", (req, res) => {
  const updatedEvent = parseEventObject(req.body);
  if (!updatedEvent.error) {
    if (req.query.user_id) {
      Event.findById(req.params.id, (error, data) => {
        if (data) {
          // checking user_id is owner
          if (data.owner_id === req.query.owner_id) {
            Event.findByIdAndUpdate(
              req.params.id,
              { ...updatedEvent },
              (error, updatedEvent) => {
                updateEvent
                  ? res.status(200).json(updatedEvent)
                  : res
                      .status(500)
                      .json({ error: "could not update the event: ", error });
              }
            );
          }
        } else {
          res.status(400).json({
            error: "cannot find the event associated with this id: " + errror,
          });
        }
      }).select("owner_id");
    } else {
      res.status(404).json({ error: "no user_id found" });
    }
  } else {
    res.status(404).json({ error: updatedEvent });
  }
});

// ========================================================== //
//    Delete one Event  => /events/:id?user_id=id PUT DELETE  //
// ========================================================== //
//
//
// to delete an event you have to sent the

module.exports = router;
