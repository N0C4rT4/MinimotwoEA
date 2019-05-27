'use strict'

const mongoose = require('mongoose')

const bikeSchema = new mongoose.Schema({
    name: {type: String,unique: true},
    distance: Number,
    description: String,
    assigned: Boolean,
});

module.exports = mongoose.model('Bike',bikeSchema);
