const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  journalEntries: { type: Schema.Types.ObjectId, ref: "Entry" },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  eventsWillAttend: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
