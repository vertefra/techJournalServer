const express = require("express");
const router = express.Router();
const Skill = require("../models/skill.js");
const { skills_filtered_id } = require("../services/utils.js");

// =========================================== //
//    Get all the skills => /skills GET        //
// =========================================== //

router.get("/", (req, res) => {
  if (!req.query.regex) {
    console.log("not regex");
    Skill.find({}, (error, allSkills) => {
      allSkills
        ? res.status(200).json(allSkills)
        : res.status(404).json({ error: "Skills not found: " + error });
    });
  } else {
    Skill.find(
      { skill: { $regex: req.query.regex, $option: "i" } },
      (error, searchResult) => {
        searchResult
          ? res.status(200).json({ searchResult })
          : res.status(404).json({ error });
      }
    );
  }
});

// =========================================== //
//    Get one Skill  => /skills/:id GET        //
// =========================================== //

router.get("/:id", (req, res) => {
  Skill.findById(req.params.id, (error, Skill) => {
    Skill
      ? res.status(200).json(Skill)
      : res.status(404).json({ error: "Skill not found: " + error });
  });
});

// =========================================== //
//    Create one Skill  => /skills POST        //
// =========================================== //

router.post("/", (req, res) => {
  // all lowercase
  req.body.skill = req.body.skill.toLowerCase();
  Skill.create(req.body, (error, createdSkill) => {
    createdSkill
      ? res.status(200).json(createdSkill)
      : res
          .status(500)
          .json({ error: "failed creating a new Skill: " + error });
  });
});

// =========================================== //
//    Delete one Skill  => /skills/:id DELETE  //
// =========================================== //

router.delete("/:id", (req, res) => {
  Skill.findByIdAndDelete(req.params.id, (error, Skill) => {
    Skill
      ? res.status(200).json(Skill)
      : res.status(404).json({ error: "Skill not found: " + error });
  });
});

module.exports = router;
