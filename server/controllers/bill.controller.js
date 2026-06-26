const Bill = require('../models/bill.model');
const Flat = require('../models/flatmodule');
const User = require('../models/usermodule');

// GENERATE BILL (Admin only)
exports.createBill = async (req, res) => {
  try {
    const { title, amount, dueDate, flatId } = req.body;

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }

    // Find the resident user associated with this flat (if any)
    const resident = await User.findOne({ flat: flatId });

    const bill = await Bill.create({
      title,
      amount,
      dueDate,
      flat: flatId,
      resident: resident ? resident._id : undefined,
      status: 'unpaid',
    });

    res.status(201).json({
      message: 'Bill generated successfully',
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL BILLS
exports.getBills = async (req, res) => {
  try {
    let bills;

    // If Resident, retrieve only bills linked to their flat or resident ID
    if (req.user.role === 'resident') {
      // Find the resident's flat first
      const user = await User.findById(req.user.id);
      if (user && user.flat) {
        bills = await Bill.find({ flat: user.flat })
          .populate('flat')
          .populate('resident', 'name email')
          .sort({ createdAt: -1 });
      } else {
        bills = await Bill.find({ resident: req.user.id })
          .populate('flat')
          .populate('resident', 'name email')
          .sort({ createdAt: -1 });
      }
    } else {
      // Admin sees all bills
      bills = await Bill.find()
        .populate('flat')
        .populate('resident', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: 'success',
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// PAY A BILL (Resident)
exports.payBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.status = 'paid';
    bill.paymentDate = new Date();
    await bill.save();

    res.status(200).json({
      message: 'Bill paid successfully',
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE BILL (Admin only)
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json({
      message: 'Bill deleted successfully',
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
