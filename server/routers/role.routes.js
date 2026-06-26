const express = require('express');
const { createRole, getRoles, getRoleById, updateRole, deleteRole } = require('../controllers/role.controller.js');

const router = express.Router();

router.post('/', createRole);
router.get('/', getRoles);
router.get('/:id', getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;