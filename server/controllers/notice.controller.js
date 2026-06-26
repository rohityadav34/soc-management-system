const Notice = require('../models/notice.model');

// CREATE NOTICE (Admin only)
exports.createNotice = async (req, res) => {
  try {
    const { title, description, expiryDate } = req.body;
    const postedBy = req.user.id; // From verifyToken middleware

    const notice = await Notice.create({
      title,
      description,
      postedBy, 
      expiryDate,
    });

    // Broadcast the notice to all users via WebSocket
    if (req.io) {
      req.io.emit('new_notice', {
        message: `${title}`,
        description: description,
        noticeId: notice._id,
      });
    }

    res.status(201).json({
      message: 'Notice created successfully',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL NOTICES
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'success',
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ONE NOTICE
exports.getNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id).populate('postedBy', 'name email');

    if (!notice) {
      return res.status(404).json({
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      message: 'success',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE NOTICE (Admin only)
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      message: 'Notice deleted successfully',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
