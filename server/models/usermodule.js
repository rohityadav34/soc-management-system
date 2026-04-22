const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:string,
        require:true
    },
    email:{
        type:string,
        require:true,
        unique:true
    },
    password:{
        type:string,
        require:true,
    },
    role:{
       type:string,
         enum:["admin", "regident","guard"]
    }
}
)
module.exports = ["User", userSchema];