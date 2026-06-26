const express = require("express");
const route = express.Router();

const { register, login, verify, logout, setupInitialPassword } = require("../controllers/authcontroller");
const verifyToken  = require("../middleware/verifyToken");
const checkRole  = require('../middleware/checkRole');

route.post('/register' , register) ;
route.post('/login' , login) ;
route.post('/verify' , verifyToken , verify)
route.post('/logout' , verifyToken , logout)
route.post('/setup-initial-password' , setupInitialPassword)
module.exports = route;


