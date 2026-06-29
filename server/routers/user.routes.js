const express = require('express');
const {
  deactivateUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  addMember,
  deleteMember,
  addVehicle,
  deleteVehicle,
} = require('../controllers/user.controller.js');
const verifyToken = require('../middleware/verifyToken.js');
const checkRole  = require('../middleware/checkRole.js');
const allowSelfOrAdmin = require('../middleware/allowSelfOrAdmin.js');
const router = express.Router();

//get all user
router.get('/users', verifyToken, checkRole(['admin']), getAllUser);
//singleuser (accessible by admin or self)
router.get('/users/:id', verifyToken, allowSelfOrAdmin, getSingleUser);
//deactivate the user => isActive : true ==> false
router.patch('/users/:id/deactivate', verifyToken, checkRole(['admin']), deactivateUser);
//delete user completely
router.delete('/users/:id', verifyToken, checkRole(['admin']), deleteUser);
//update (accessible by admin or self)
router.patch('/users/:id', verifyToken, allowSelfOrAdmin, updateUser);

// Resident family members endpoints
router.post('/users/:id/members', verifyToken, allowSelfOrAdmin, addMember);
router.delete('/users/:id/members/:memberId', verifyToken, allowSelfOrAdmin, deleteMember);

// Resident vehicles endpoints
router.post('/users/:id/vehicles', verifyToken, allowSelfOrAdmin, addVehicle);
router.delete('/users/:id/vehicles/:vehicleId', verifyToken, allowSelfOrAdmin, deleteVehicle);

module.exports = router;