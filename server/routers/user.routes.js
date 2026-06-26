const express = require('express');
const {
  deactivateUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller.js');
const verifyToken = require('../middleware/verifyToken.js');
const checkRole  = require('../middleware/checkRole.js');
const router = express.Router();

//get all user
router.get('/users', verifyToken, checkRole(['admin']), getAllUser);
//singleuser
router.get('/users/:id', verifyToken, checkRole(['admin']), getSingleUser);
//deactivate the user => isActive : true ==> false
router.patch('/users/:id/deactivate', verifyToken, checkRole(['admin']), deactivateUser);
//delete user completely
router.delete('/users/:id', verifyToken, checkRole(['admin']), deleteUser);
//update
router.patch('/users/:id', verifyToken, checkRole(['admin']), updateUser);

module.exports = router;