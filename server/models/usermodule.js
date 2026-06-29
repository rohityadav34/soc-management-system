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
  members: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
    }
  ],
  vehicles: [
    {
      vehicleType: { type: String, required: true },
      vehicleNumber: { type: String, required: true },
      parkingSlot: { type: String, required: true },
    }
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
