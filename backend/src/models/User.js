const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Super Admin", "Store Admin", "Store Employee"],
    default: "Store Employee",
  },
});

module.exports = mongoose.model("User", UserSchema);
