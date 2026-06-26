const express = require("express");
 
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaint.controller.js");
 
const verifyToken = require("../middleware/verifyToken.js");
const  checkRole  = require("../middleware/checkRole.js");
const router = express.Router();
 
// CREATE
router.post(
  "/",
//   verifyToken,
//   checkRole(["resident", "admin"]),
  createComplaint
);
 
// GET ALL
router.get(
  "/",
  verifyToken,
  checkRole(["resident", "admin"]),
  getComplaints
);
 
// GET ONE
router.get(
  "/:id",
  verifyToken,
  checkRole(["resident", "admin"]),
  getComplaint
);
 
// UPDATE
router.patch(
  "/:id",
  verifyToken,
  checkRole(["resident", "admin"]),
  updateComplaint
);
 
// DELETE
router.delete(
  "/:id",
  verifyToken,
  checkRole(["resident", "admin"]),
  deleteComplaint
);
 
module.exports = router;
