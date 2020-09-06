const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true },
    journalEntries: { type: mongoose.Schema.Types.ObjectId, ref: "Entry" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
