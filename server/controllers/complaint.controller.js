const Complaint = require ('../models/complaint.model.js');
const User = require ('../models/usermodule.js');
const notificationService = require('../lib/notificationService');
// CREATE COMPLAINT
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    console.log(req.io);

    const resident = req.body.resident || req.user.id;

    const complaint = await Complaint.create({
      title,
      description,
      status: status || 'pending',
      resident,
    });

    const allUsers = await User.find().populate('role');
    const adminUsers = allUsers.filter((user) => user.role && (user.role.role === 'admin' || user.role.name === 'admin'));

    adminUsers.forEach((admin) => {
      notificationService.sendToUser(admin._id, 'new_complaint', {
        message: `New complaint filed: "${complaint.title}"`,
        title: complaint.title,
        complaintId: complaint._id,
      });
    });

    res.status(201).json({
      message: 'Complaint created successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    // ✅ Resident → only own complaints
    if (req.user.role === 'resident') {
      complaints = await Complaint.find({
        resident: req.user.id,
      })
        .populate('resident', 'name email')
        .sort({ createdAt: -1 });
    }

    // ✅ Admin → all complaints
    else {
      complaints = await Complaint.find()
        .populate('resident', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: 'success',
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// GET ONE COMPLAINT
exports.getComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate(
      'resident',
      'name email'
    );

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      message: 'success',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE COMPLAINT
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found',
      });
    }

    if (complaint.resident) {
      notificationService.sendToUser(complaint.resident, 'complaint_status_update', {
        message: `Your complaint "${complaint.title}" is now "${complaint.status}"`,
        title: complaint.title,
        complaintId: complaint._id,
        status: complaint.status
      });
    }

    res.status(200).json({
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE COMPLAINT
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      message: 'Complaint deleted successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};