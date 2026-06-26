const express = require('express');
const {
  createNotice,
  getNotices,
  getNotice,
  deleteNotice,
} = require('../controllers/notice.controller');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// GET ALL
router.get('/', verifyToken, getNotices);

// GET ONE
router.get('/:id', verifyToken, getNotice);

// CREATE (Admin only)
router.post('/', verifyToken, checkRole(['admin']), createNotice);

// DELETE (Admin only)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteNotice);

module.exports = router;
