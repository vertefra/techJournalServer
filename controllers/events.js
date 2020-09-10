const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { paginate, parseEventObject } = require("../services/utils");
const e = require("express");
const User = require("../models/user");

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

// =========================================== //
//    Show one Event => /events/:id GET        //
// =========================================== //

router.get("/:id", (req, res) => {
  Event.findById(req.params.id, (error, foundEvent) => {
    foundEvent
      ? res.status(200).json(foundEvent)
      : res.status(400).json({ error: "cant find the event: " + error });
  });
});

// ================================================ //
//    Update an Event => /events/:id?user_id=id PUT //
// ================================================ //

router.put("/:id", (req, res) => {
  const updatedEvent = parseEventObject(req.body);
  if (!updatedEvent.error) {
    if (req.query.user_id) {
      Event.findById(req.params.id, (error, data) => {
        if (data) {
          // checking user_id is owner
          if (data.owner_id.toString() === req.query.user_id.toString()) {
            Event.findByIdAndUpdate(
              req.params.id,
              { ...updatedEvent },
              (error, updatedEvent) => {
                updatedEvent
                  ? res.status(200).json(updatedEvent)
                  : res
                      .status(500)
                      .json({ error: "could not update the event: ", error });
              }
            );
          } else {
            res.status(404).json({
              error:
                "Id provided is not from the post owner. ID: " + req.params.id,
            });
          }
        } else {
          res.status(400).json({
            error: "cannot find the event associated with this id: " + error,
          });
        }
      }).select("owner_id");
    } else {
      res.status(404).json({
        error:
          "no user_id found in the url query. please add ?user_id= and the event's owner user id",
      });
    }
  } else {
    res.status(404).json({ error: updatedEvent });
  }
});

// ========================================================== //
//    Delete one Event  => /events/:id?user_id=id  DELETE  //
// ========================================================== //
//
//

router.delete("/:id", (req, res) => {
  const user_id = req.query.user_id;
  if (user_id) {
    Event.findById(req.params.id, (error, foundEvent) => {
      if (foundEvent) {
        if (foundEvent.owner_id.toString() === user_id.toString()) {
          Event.findByIdAndDelete(req.params.id, (error, deletedEvent) => {
            if (deletedEvent) {
              // remove the reference from the user
              User.findByIdAndUpdate(
                user_id,
                { $pull: { createdEvents: req.params.id } },
                (error, updatedUser) => {
                  updatedUser
                    ? res.status(200).json({
                        message:
                          "event deleted and reference from the owner removed: " +
                          updatedUser,
                      })
                    : res.status(500).json({
                        error:
                          "Event removed but could not remove the reference from the owner: " +
                          error,
                      });
                }
              );
            } else {
              res.status(500).res({
                error: "for some reason I cannot delete this event: " + error,
              });
            }
          });
        } else {
          res.status(404).json({
            error:
              "Id provided is not from the post owner. ID: " + req.params.id,
          });
        }
      } else {
        res.status(400).json({ error: "Cannot find the event: ", error });
      }
    }).select("owner_id");
  } else {
    res.status(404).json({
      error:
        "no user_id found in the url query. please add ?user_id= and the event's owner user id",
    });
  }
});

module.exports = router;
