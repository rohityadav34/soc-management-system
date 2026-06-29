const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    block: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
    },

    slotNumber: {
      type: String,
      required: true,
      unique: true,
    },

    residentName: {
      type: String,
      default: "",
    },

    flatNumber: {
      type: String,
      default: "",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["vacant", "occupied"],
      default: "vacant",
    },

    allottedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);