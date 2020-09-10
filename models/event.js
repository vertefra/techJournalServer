const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  location: {
    name: String,
    formatted_address: String,
    lat: String,
    lng: String,
  },
  topics: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  host: {
    name: String,
    title: String,
    email: String,
    phoneNumber: String,
  },

  speaker: {
    name: String,
    title: String,
  },
  owner_id: { type: Schema.Types.ObjectId, ref: "User" },
  partecipants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
