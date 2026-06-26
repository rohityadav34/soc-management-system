const jwt = require("jsonwebtoken");

exports.generateToken = (payload)=>{
 return jwt.sign(payload, process.env.JWT_SECRET_STRING,{expiresIn : process.env.JWT_EXPIRES_IN})
}