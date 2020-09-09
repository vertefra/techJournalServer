const express = require("express");
const router = express.Router();
const Skill = require("../models/skill.js");
const { returnParams } = require("../services/utils.js");
const User = require("../models/user.js");

// ===================================================== //
//    Get all the skills => /users/:id/skills GET        //
// ===================================================== //
//
// returns all the skills for a user

router.get("/", (req, res) => {
  const user_id = returnParams(req)[0];
  User.findById(user_id, (error, foundUser) => {
    foundUser
      ? res.status(200).json(foundUser.skills)
      : res.status(404).json({ error: "user or skills not found: " + error });
  }).populate("skills");
});

// ===================================================== //
//    Get one Skill  => /users/:id/skills/:id GET        //
// ===================================================== //

router.get("/:id", (req, res) => {
  const [user_id, skill_id] = returnParams(req);
  User.findById(user_id, (error, foundUser) => {
    if (foundUser) {
      const skill = foundUser.skills.find(
        (skill) => skill._id.toString() === skill_id
      );
      res.status(200).json(skill);
    } else {
      res
        .status(404)
        .json({ error: `Cant find skill with id: ${skill_id}: `, error });
    }
  }).populate("skills");
});

// ===================================================== //
//    Add one Skill  => /users/:id/skills POST           //
// ===================================================== //
//
// add one skill to the user with id === users/:id
// first look into the Skill model to check if the skill
// is already present. If not creates a new skill and add
// the id of the created skill to the user in 'skills'

// TODO ADDING A COUNT INCREMENT TO SHOW SKILLS POPOLARITY

router.post("/", (req, res) => {
  const user_id = returnParams(req)[0];
  const skill = req.body.skill.toLowerCase();
  Skill.findOne({ skill }, (error, foundSkill) => {
    if (foundSkill) {
      User.findByIdAndUpdate(
        user_id,
        { $push: { skills: foundSkill._id } },
        (error, updatedUser) => {
          updatedUser
            ? res.status(200).json({ updatedUser: true, result: updatedUser })
            : res
                .status(500)
                .json({ error: "Could not update the skill: " + error });
        }
      );
    } else {
      // if the skill does not exist create it
      console.log("Skill not found. adding ", skill);
      Skill.create({ skill }, (error, createdSkill) => {
        if (createdSkill) {
          User.findByIdAndUpdate(
            user_id,
            { $push: { skills: createdSkill._id } },
            (error, updatedUser) => {
              updatedUser
                ? res
                    .status(200)
                    .json({ updatedUser: true, result: updatedUser })
                : res
                    .status(500)
                    .json({ error: "Could not update the skill: " + error });
            }
          );
        } else {
          res
            .status(500)
            .json({ error: "failed creating a new Skill: " + error });
        }
      });
    }
  });
});

// ====================================================== //
//    Delete one Skill  => /users/:id/skills/:id   DELETE //
// ====================================================== //
//
// Remove skills/:id from the skills of the users/:id

router.delete("/:id", (req, res) => {
  const [user_id, skill_id] = returnParams(req);
  User.findByIdAndUpdate(
    user_id,
    { $pull: { skills: skill_id } },
    (error, updatedUser) => {
      updatedUser
        ? res.status(200).json({ updatedSkills: true, result: updatedUser })
        : res
            .status(500)
            .json({ error: "Could not delete the skill: " + error });
    }
  );
});

module.exports = router;
