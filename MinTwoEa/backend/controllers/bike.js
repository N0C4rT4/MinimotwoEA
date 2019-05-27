'use strict'

const Bike = require('../models/bike')
const Station = require('../models/station')

function getBike(req, res) {
    console.log('GET /api/bike/:bikeId')

    let bikeId = req.params.bikeId

    Bike.findById(bikeId, (err, bike) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la bici: ${err}` })

        if (!bike)
            return res.status(404).send({ message: `bici no existe` })

        res.status(200).send({ bike: bike })
    })
}

function getBikes(req, res) {
    console.log('GET /api/bike/')

    Bike.find({}, (err, bikes) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la bike: ${err}` })

        if (!bikes)
            return res.status(404).send({ message: `no hay` })

        res.status(200).send({ bikes })
    })
}

function saveBike(req, res) {
    console.log('POST /api/bike')
    console.log(req.body)

    let bike = new Bike()
    bike.name = req.body.name
    bike.distance = req.body.distance
    bike.description = req.body.description
    bike.assigned = false

    bike.save((err, bikeStored) => {
        if (err)
            return res.status(500).send({ message: `Error al salvar en la  DB: ${err}` })

        res.status(200).send({ bike: bikeStored })

    })
}

function updateBike(req, res) {
    console.log('PUT /api/bike/:bikeId')

    let bikeId = req.params.bikeId
    let update = req.body

    Bike.findByIdAndUpdate(bikeId, update, (err, bikeUpdated) => {
        if (err)
            return res.status(500).send({ message: `Error al actualizar: ${err}` })

        if (!bikeUpdated)
            return res.status(404).send({ message: `Bike no existe` })

        res.status(200).send({ bike: bikeUpdated })
    })
}

function deleteBike(req, res) {
    console.log('DELETE /api/bike/:bikeId')

    let bikeId = req.params.bikeId

    Bike.findById(bikeId, (err, bike) => {
        if (err)
            return res.status(500).send({ message: `Error al borrar the bici: ${err}` })

        if (!bike)
            return res.status(404).send({ message: `Bike no existe` })

        bike.remove(err => {
            if (err)
                return res.status(500).send({ message: `Error al borrar la bici: ${err}` })

            res.status(200).send({ message: "Bike borrada correctamente" })
        })
    })
}




function getUnBike(req, res) {
    console.log('GET /api/bike/un')


    Bike.find({ assigned: false }, (err, bike) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la bici: ${err}` })

        if (!bike)
            return res.status(404).send({ message: `no asignadas` })

        console.log(bike)
        res.status(200).send(bike)
    })
}


function addToStation(req, res) {
    Station.findById(req.params.stationId, (err, station) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar station: ${err}` })

        if (!station)
            return res.status(404).send({ message: `La estacion no existe` })
        Bike.findById(req.params.bikeId, (err, bike) => {
            if (err)
                return res.status(500).send({ message: `Error al buscar bikes: ${err}` })

            if (!bike)
                return res.status(404).send({ message: `La bici no existe` })
            if (bike.assigned == false) {
                station.bikes.push(bike._id);
                station.state = true;
                station.save((err, stationStored) => {
                    if (err)
                        return res.status(500).send({ message: `Error al salvar  DB: ${err}` })
                    bike.assigned = true;
                    bike.save((err, bikeStored) => {
                        if (err) {
                            return res.status(500).send({ message: `Error al salvar DB: ${err}` })
                        }
                        res.status(200).send(stationStored)
                    })
                })
            } else {
                res.status(500).send({ message: "Bike asignada" })
            }
        })
    })

}

module.exports = {
    getBike,
    getBikes,
    saveBike,
    updateBike,
    deleteBike,
    getUnBike,
    addToStation,


}