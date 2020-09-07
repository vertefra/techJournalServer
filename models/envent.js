const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  topics: { type: Schema.Types.ObjectId, ref: "Skill" },
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
  eventOwner_id: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
