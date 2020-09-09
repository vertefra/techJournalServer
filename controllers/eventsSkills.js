const express = require("express");
const Skill = require("../models/skill");
const Event = require("../models/event");
const { returnParams } = require("../services/utils");
const router = express.Router();

// =================================================== //
//    Add one skill => /events/:id/skills POST         //
// =================================================== //
//
// Add the reference of one skill by name.
// Attach the skill in the body in a json object with
// property skill

router.post("/", (req, res) => {
  const event_id = returnParams(req)[0];
  const skill = req.body.skill.toLowerCase();
  Skill.findOne({ skill }, (error, foundSkill) => {
    if (foundSkill) {
      // if the skill is found add the reference to the event
      Event.findByIdAndUpdate(
        event_id,
        { $push: { topics: foundSkill._id } },
        (error, foundEvent) => {
          if (foundEvent) {
            res.status(200).json({
              message:
                "skill reference added correctly to event: " + foundEvent,
            });
          } else {
            res.status(404).json("Event not found: " + error);
          }
        }
      );
    } else {
      // skill was not found, create a new one with that name
      Skill.create({ skill }, (error, createdSkill) => {
        if (createdSkill) {
          //adding the reference to the event
          Event.findByIdAndUpdate(
            event_id,
            { $push: { topics: createdSkill._id } },
            (error, foundEvent) => {
              if (foundEvent) {
                res.status(200).json({
                  message:
                    "skill reference added correctly to event: " + foundEvent,
                });
              } else {
                res.status(404).json("Event not found: " + error);
              }
            }
          );
        } else {
          res
            .status(500)
            .json({ error: "could not create the skill: " + error });
        }
      });
    }
  });
});

// ======================================================= //
//    Remove one skill => /events/:id/skills/:id DELETE    //
// ======================================================= //
//
// Remove the reference of the skill with id skills/:id
// from the event events/:id

router.delete("/:id", (req, res) => {
  const [event_id, skill_id] = returnParams(req);
  Event.findByIdAndUpdate(
    event_id,
    { $pull: { topics: skill_id } },
    (error, updatedEvent) => {
      updatedEvent
        ? res
            .status(200)
            .json({ message: "reference to skill removed: " + updatedEvent })
        : res.status(500).json({
            error: "copuld not remove the reference to skill: " + error,
          });
    }
  );
});

// ======================================================= //
//    See all the skills => /events/:id/skills GET         //
// ======================================================= //
//
// Show all the skills associated with an event with id
// events/:id

router.get("/", (req, res) => {
  const event_id = returnParams(req)[0];
  Event.findById(event_id, (error, foundSkills) => {
    foundSkills
      ? res.status(200).json(foundSkills)
      : res.status(404).json({ error: "could not find the skills: " + error });
  })
    .populate("topics")
    .select("topics");
});

module.exports = router;
