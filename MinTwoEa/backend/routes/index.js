'use strict'


const express = require('express')
const api = express.Router()
const apiBikes = require('./bike')
const apiStations = require('./station')



api.use('/bike', apiBikes)
api.use('/station', apiStations)



module.exports = api