const User = require( '../models/usermodule.js');
const { generateHash } = require( '../lib/hashpassword.js');
const { cleanupUnassignedFlats } = require('./flat.controller.js');

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().populate('role').populate('flat').select('-password');
    res.status(200).json({
      message: 'success',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('role').populate('flat');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const user = await User.findById(id).populate('role');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (updateData.password) {
      updateData.password = await generateHash(updateData.password);
    }

    // Map roleId to role
    if (updateData.roleId !== undefined) {
      updateData.role = updateData.roleId || null;
      delete updateData.roleId;
    }

    let targetRole = user.role?.role;
    if (updateData.role) {
      const Role = require("../models/rolemodule.js");
      const roleObj = await Role.findById(updateData.role);
      if (roleObj) {
        targetRole = roleObj.role;
      }
    }

    const Flat = require("../models/flatmodule.js");

    if (targetRole === 'resident') {
      const newFlatId = updateData.flatId;
      if (newFlatId !== undefined) {
        const currentFlatId = user.flat ? user.flat.toString() : null;
        if (newFlatId !== currentFlatId) {
          // Free the previous flat
          if (user.flat) {
            await Flat.findByIdAndUpdate(user.flat, { isaccopied: false });
          }
          // Occupy the new flat
          if (newFlatId) {
            await Flat.findByIdAndUpdate(newFlatId, { isaccopied: true });
            updateData.flat = newFlatId;
          } else {
            updateData.flat = null;
          }
        }
      }
    } else {
      // If no longer a resident, free their flat
      if (user.flat) {
        await Flat.findByIdAndUpdate(user.flat, { isaccopied: false });
      }
      updateData.flat = null;
    }

    // Clean up updateData parameters
    delete updateData.flatId;
    delete updateData.flatNumber;
    delete updateData.block;
    delete updateData.floor;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('role')
      .populate('flat');

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Free the flat if the user is a resident assigned to a flat
    if (user.flat) {
      const Flat = require("../models/flatmodule.js");
      await Flat.findByIdAndUpdate(user.flat, { isaccopied: false });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User deleted successfully',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
