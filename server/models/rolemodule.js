const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "resident", "security-guard"],
    trim: true,
    unique: true,
  },

  roleDesription: {
    type: String,
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
