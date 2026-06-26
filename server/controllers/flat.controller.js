const Flat = require('../models/flatmodule.js');
const User = require('../models/usermodule.js');

const cleanupUnassignedFlats = async () => {
  // Cleanup disabled - vacant flats should persist and be displayable
};

const createFlat = async (req, res) => {
  try {
    const { flatNumber, block, floor } = req.body;
    
    // Check if flat already exists
    const existingFlat = await Flat.findOne({ flatNumber, block });
    if (existingFlat) {
      return res.status(400).json({ message: 'Flat already exists in this block' });
    }

    const newFlat = await Flat.create({ 
      flatNumber, 
      block, 
      floor,
      isaccopied: false
    });

    res.status(201).json({
      message: 'Flat created successfully',
      data: newFlat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getFlats = async (req, res) => {
  try {
    await cleanupUnassignedFlats();
    const flats = await Flat.find();
    // Find all users who are assigned to any of these flats
    const users = await User.find({ flat: { $in: flats.map(f => f._id) } });
    
    // Map flat ID to resident name & ID
    const flatToUserMap = {};
    users.forEach(user => {
      if (user.flat) {
        flatToUserMap[user.flat.toString()] = {
          name: user.name,
          id: user._id
        };
      }
    });

    // Add resident details to each flat data object
    const flatsWithResident = flats.map(flat => {
      const flatObj = flat.toObject();
      const resident = flatToUserMap[flat._id.toString()];
      flatObj.residentName = resident ? resident.name : 'N/A';
      flatObj.residentId = resident ? resident.id : null;
      return flatObj;
    });

    res.status(200).json({ data: flatsWithResident });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFlatById = async (req, res) => {
  try {
    await cleanupUnassignedFlats();
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    
    const user = await User.findOne({ flat: flat._id });
    const flatObj = flat.toObject();
    flatObj.residentName = user ? user.name : 'N/A';
    flatObj.residentId = user ? user._id : null;

    res.status(200).json({ data: flatObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFlat = async (req, res) => {
  try {
    const { flatNumber, block, floor, residentId } = req.body;
    const flatId = req.params.id;

    // Check if flat exists
    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    // Update flat fields
    flat.flatNumber = flatNumber !== undefined ? flatNumber : flat.flatNumber;
    flat.block = block !== undefined ? block : flat.block;
    flat.floor = floor !== undefined ? floor : flat.floor;

    // If residentId is changed
    // Find current user with this flat
    const currentUserWithFlat = await User.findOne({ flat: flatId });
    const currentResidentId = currentUserWithFlat ? currentUserWithFlat._id.toString() : null;

    if (residentId !== undefined && residentId !== currentResidentId) {
      // Clear old resident
      await User.updateMany({ flat: flatId }, { $unset: { flat: 1 } });

      if (residentId) {
        // Assign new resident
        const user = await User.findById(residentId);
        if (user) {
          user.flat = flatId;
          await user.save();
        }
        flat.isaccopied = true;
      } else {
        flat.isaccopied = false;
      }
    }

    const updatedFlat = await flat.save();
    await cleanupUnassignedFlats();

    res.status(200).json({
      message: 'Flat updated successfully',
      data: updatedFlat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFlat = async (req, res) => {
  try {
    const flatId = req.params.id;
    const deletedFlat = await Flat.findByIdAndDelete(flatId);
    if (!deletedFlat) return res.status(404).json({ message: 'Flat not found' });

    // Clear flat assignments for any user
    await User.updateMany({ flat: flatId }, { $unset: { flat: 1 } });

    await cleanupUnassignedFlats();

    res.status(200).json({ message: 'Flat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableFlats = async (req, res) => {
  try {
    await cleanupUnassignedFlats();
    const flats = await Flat.find({ isaccopied: false });

    res.status(200).json({
      message: "Available Flats",
      count: flats.length,
      data: flats
    });

  } catch (error) {
    res.json({ error: error.message });
  }
};

const getOccupiedFlats = async (req, res) => {
  try {
    await cleanupUnassignedFlats();
    const flats = await Flat.find({ isaccopied: true });

    res.status(200).json({
      message: "Occupied Flats",
      count: flats.length,
      data: flats
    });

  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {createFlat , getFlats, getFlatById , updateFlat , deleteFlat , getAvailableFlats, getOccupiedFlats, cleanupUnassignedFlats};