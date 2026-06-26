const express = require('express');
const {
  createBill,
  getBills,
  payBill,
  deleteBill,
} = require('../controllers/bill.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// GET ALL (Resident & Admin)
router.get('/', verifyToken, getBills);

// PAY BILL (Resident)
router.patch('/:id/pay', verifyToken, checkRole(['resident']), payBill);

// GENERATE BILL (Admin)
router.post('/', verifyToken, checkRole(['admin']), createBill);

// DELETE BILL (Admin)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteBill);

module.exports = router;
