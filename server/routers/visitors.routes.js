const express = require('express');
const {
  registerVisitor,
  getVisitors,
  updateVisitorStatus,
} = require('../controllers/visitors.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/visitors', verifyToken, registerVisitor);
router.get('/visitors', verifyToken, getVisitors);
router.post('/visitors/status', verifyToken, updateVisitorStatus);

module.exports = router;