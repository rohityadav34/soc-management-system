const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
   type: String,
    require: true,
  },
  email:{
    type: String,
    require: true,
    unique: true,
  },
  phone:{
    type: Number
  },
  password: {
   type: String,
    require: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  profilePhoto: {
type: String
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
