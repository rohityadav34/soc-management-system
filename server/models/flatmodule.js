const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
    flatNumber:{
        type:Number,
        trim:true
    },
    block:{
        type:String
    },
    floor:{
        type:Number
    },
    isaccopied:{
        type:Boolean,
        default:false
    }
});

const Flat = mongoose.model('Flat' , flatSchema)

module.exports =  Flat;