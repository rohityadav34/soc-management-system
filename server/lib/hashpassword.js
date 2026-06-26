const bcrypt = require("bcrypt");

exports.generateHash = async(password) =>{
    return await bcrypt.hash(password,12)
}

exports.comparePassword = async(password , hashPassword) => {
    return await bcrypt.compare(password , hashPassword)
}