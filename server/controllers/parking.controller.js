const Parking = require("../models/parking.model");

exports.createParking = async (req, res) => {
  try {
    const {
      block,
      slotNumber,
      residentName,
      flatNumber,
      vehicleNumber,
    } = req.body;

    const parking = await Parking.create({
      block,
      slotNumber,
      residentName,
      flatNumber,
      vehicleNumber,
      status: vehicleNumber ? "occupied" : "vacant",
    });

    res.status(201).json({
      success: true,
      message: "Parking created successfully",
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllParking = async (req, res) => {
  try {
    const parking = await Parking.find().sort({
      block: 1,
      slotNumber: 1,
    });

    res.status(200).json({
      success: true,
      count: parking.length,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking updated successfully",
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyParking = async (req, res) => {
  try {
    const User = require("../models/usermodule");
    const user = await User.findById(req.user.id).populate("flat");
    
    let query = {};
    if (user && user.flat) {
      const flatNumStr = String(user.flat.flatNumber);
      query = {
        $or: [
          { block: user.flat.block, flatNumber: flatNumStr },
          { residentName: user.name }
        ]
      };
    } else if (user) {
      query = { residentName: user.name };
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const parking = await Parking.findOne(query);

    res.status(200).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(
      req.params.id
    );

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};