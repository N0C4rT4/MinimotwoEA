'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stationSchema = new mongoose.Schema({
        name: {type: String,unique: true},
        state: Boolean,//avaiable or not
        description: String,
        bikes: [{ type: Schema.Types.ObjectId, ref: 'Bike' }]
});

module.exports = mongoose.model('Station',stationSchema);
