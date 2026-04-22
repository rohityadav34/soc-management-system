const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
    flatnumber:{
        type:Number,
        trim:true
    },
    block:{
        type:"string"
    },
    flat:{
        type:Number
    }
});

module.exports = [ "Flat", flatSchema];