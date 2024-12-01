const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  permissions: [{ type: String }],
});

module.exports = mongoose.model("Role", RoleSchema);
