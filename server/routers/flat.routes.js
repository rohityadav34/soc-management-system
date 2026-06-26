const express = require('express');
const { createFlat, getFlats, getFlatById, updateFlat, deleteFlat, getAvailableFlats, getOccupiedFlats }  = require('../controllers/flat.controller');

const router = express.Router();

router.post('/',  createFlat);
router.get('/', getFlats);
router.get("/occupied-flats", getOccupiedFlats);
router.get("/available-flats", getAvailableFlats);
router.get("/available", getAvailableFlats);
router.get('/:id', getFlatById);
router.put('/:id', updateFlat);
router.delete('/:id', deleteFlat);

module.exports =  router;