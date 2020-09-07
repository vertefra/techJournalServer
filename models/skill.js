const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  skill: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
