const express = require("express");
const router = express.Router();

const {
  createParking,
  getAllParking,
  updateParking,
  deleteParking,
  getMyParking,
} = require("../controllers/parking.controller");

const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Admin + Guard Parking List
router.get(
  "/",
  verifyToken,
  checkRole("admin", "guard"),
  getAllParking
);

// Admin Create Parking
router.post(
  "/",
  verifyToken,
  checkRole("admin"),
  createParking
);

// Admin Update Parking
router.patch(
  "/:id",
  verifyToken,
  checkRole("admin"),
  updateParking
);

// Admin Delete Parking
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  deleteParking
);

// Resident ki apni parking
router.get(
  "/my-parking",
  verifyToken,
  getMyParking
);

module.exports = router;