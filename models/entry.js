const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntrySchema = new Schema(
  {
    entries: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", EntrySchema);

module.exports = Entry;
