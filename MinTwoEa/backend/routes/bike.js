'use strict'


const express = require('express');
const apiBikes = express.Router();
const bikeCtrl = require('../controllers/bike');



apiBikes.get('/', bikeCtrl.getBikes);
apiBikes.get('/un', bikeCtrl.getUnBike);
apiBikes.get('/:bikeId', bikeCtrl.getBike);
apiBikes.post('/', bikeCtrl.saveBike);
apiBikes.put('/:bikeId', bikeCtrl.updateBike);
apiBikes.delete('/:bikeId', bikeCtrl.deleteBike);
apiBikes.get('/:stationId/:bikeId', bikeCtrl.addToStation);



module.exports = apiBikes