const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    journalEntries: { type: mongoose.Schema.Types.ObjectId, ref: "Entry" },
    skills: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Skill", unique: true },
    ],
    eventsWillAttend: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Event", unique: true },
    ],
    createdEvents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Event", unique: true },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
