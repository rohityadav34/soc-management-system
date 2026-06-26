const User = require('../models/usermodule.js');
const Visitor = require('../models/visitors.model.js');
const notificationService = require('../lib/notificationService');

// REGISTER VISITOR (Guard only)
exports.registerVisitor = async (req, res) => {
  try {
    const { name, type, phone, purpose, flatId, userId } = req.body;

    const user = await User.findOne({ flat: flatId });
    if (!user) {
      return res.status(404).json({ message: 'Resident not found for this flat.' });
    }

    const visitor = await Visitor.create({
      name,
      type,
      phone,
      flat: flatId,
      purpose,
      registeredBy: userId || req.user.id,
      status: 'pending',
    });

    // Send real-time socket request to the resident
    notificationService.sendToUser(user._id, 'visitor_approval_request', {
      visitorId: visitor._id,
      name,
      type,
      purpose: purpose || 'Guest Visit',
    });

    res.status(201).json({
      message: 'Visitor registered, waiting for resident approval.',
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL VISITOR LOGS
exports.getVisitors = async (req, res) => {
  try {
    let visitors;

    if (req.user.role === 'resident') {
      const user = await User.findById(req.user.id);
      if (user && user.flat) {
        visitors = await Visitor.find({ flat: user.flat })
          .populate('flat')
          .populate('registeredBy', 'name email')
          .sort({ createdAt: -1 });
      } else {
        visitors = [];
      }
    } else {
      // Admin/Guard sees all logs
      visitors = await Visitor.find()
        .populate('flat')
        .populate('registeredBy', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: 'success',
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE VISITOR STATUS (Approve/Reject)
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { visitorId, action } = req.body; // action: 'accepted' or 'rejected'
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor record not found.' });
    }

    visitor.status = action;

    if (action === 'accepted') {
      visitor.checkIn = new Date();
    } else if (action === 'rejected') {
      visitor.checkOut = new Date(); // Or just keep it as rejected
    }

    await visitor.save();

    res.status(200).json({
      message: `Visitor entry ${action} successfully.`,
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};