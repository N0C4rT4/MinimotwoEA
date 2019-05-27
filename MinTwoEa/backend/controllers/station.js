'use strict'

const Station = require('../models/station')
const Bike = require('../models/bike')

function getStations(req, res) {
    //Funcio per obtindre el nom,descripcio i estat de totes les assignature
    console.log("Peticio de obtindre totes les estacions")
    Station.find({}, (err, stations) => {
        if (err) {
            return res.status(500).send({ message: `Error al obtener las estaciones: ${err}` })
        } else if (!stations.length) {
            console.log("No hay ninguna asignatura")
            return res.status(403).send({ message: `No hay estaciones` })
        } else {
            console.log("Enviando lista de estaciones" + stations)
            res.status(200).send(stations);
        }
    })

}

function getStation(req, res) {
    //Funcio per obtindre una asignatura en base al seu ID
    console.log("Peticio de obtindre una estacio")
    let stationId = req.params.stationId
        //Al demanar només una asignatura enviem tota la llista de alumnes
    Station.findById(stationId, (err, asig) => {
        if (err)
            return res.status(500).send({ message: `Error al obtener las estacions: ${err}` })
        else if (!asig)
            return res.status(403).send({ message: `No existe ninguna asignatura con ese ID ` + req.params.stationId })
        else
            res.status(200).send(asig);
    })

}

function updateStation(req, res) {
    console.log('PUT /api/station/:stationId')

    let stationId = req.params.stationId
    let update = req.body

    Station.findByIdAndUpdate(stationId, update, (err, stationUpdated) => {
        if (err)
            return res.status(500).send({ message: `Error updating the station: ${err}` })

        if (!stationUpdated)
            return res.status(404).send({ message: `Station does not exist` })

        res.status(200).send({ station: stationUpdated })
    })
}

function deleteStation(req, res) {
    console.log('DELETE /api/station/:stationId')

    let stationId = req.params.stationId

    Station.findById(stationId, (err, station) => {
        if (err)
            return res.status(500).send({ message: `Error deleting the station: ${err}` })

        if (!station)
            return res.status(404).send({ message: `Station does not exist` })

        station.remove(err => {
            if (err)
                return res.status(500).send({ message: `Error deleting the station: ${err}` })

            res.status(200).send({ message: "Station deleted correctly" })
        })
    })
}


function saveStation(req, res) {

    const stationNew = new Station({
        name: req.body.name,
        bikes: req.body.bikes,
        description: req.body.description,
    })
    if (req.body.bikes)
        stationNew.state = true
    else stationNew.state = false


    console.log("Añadir station:" + stationNew)
    Station.find({ name: req.body.name }).lean().exec(function(err, subj) {
        if (err) {
            return res.status(500).send({ message: `Error al añadir la estacion: ${err}` })
        }
        if (!subj.length) {
            stationNew.save((err) => {
                if (err) {
                    console.log("Error al añadir la estacion " + req.body.name + ". ya esxite la estaicion con este nombre")
                    return res.status(403).send({ message: `Error al añadir la estacion: ${err}` })
                }
                console.log("estacion: " + req.body.name + " agregada ok")
                res.status(200).send(stationNew)
            })
        } else {
            console.log("Error al añadir la estacion " + req.body.name + ". Ja existe la estacion con este nombre")
            return res.status(403).send({ message: `Error al añadir la estacion: ${err}` })
        }
    })

}


function addBike(req, res) {
    Station.findById(req.params.stationId, (err, station) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la station: ${err}` })

        if (!station)
            return res.status(404).send({ message: `La estacion no existe` })
        Bike.findById(req.params.bikeId, (err, bike) => {
            if (err)
                return res.status(500).send({ message: `Error al buscar las bicis: ${err}` })

            if (!bike)
                return res.status(404).send({ message: `La bici no existe` })
            if (bike.assigned == false) {
                station.bikes.push(bike._id);
                station.state = true;
                station.save((err, stationStored) => {
                    if (err)
                        return res.status(500).send({ message: `Error al salva en BBDD: ${err}` })
                    bike.assigned = true;
                    bike.save((err, bikeStored) => {
                        if (err) {
                            return res.status(500).send({ message: `Error al salvar en BBDD: ${err}` })
                        }
                        res.status(200).send(stationStored)
                    })
                })
            } else {
                res.status(500).send({ message: "Bici asignada" })
            }
        })
    })
}

function removeBike(req, res) {
    Bike.findById(req.params.bikeId, (err, bike) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la bici: ${err}` })

        if (!bike)
            return res.status(400).send({ message: `La bici no existe` })

        Station.update({ _id: req.params.stationId }, { $pull: { bikes: req.params.bikeId } }, (err, doc) => {
            if (err)
                return res.status(500).send({ message: `Error al buscar la estacion: ${err}` })
            if (!doc)
                return res.status(404).send({ message: `La station no existe` })

            bike.assigned = false;
            Station.findById(req.params.stationId, (err, station) => {
                if (station.bikes.length === 0) {
                    station.state = false;
                }
                bike.save((err, bikeStored) => {
                    station.save((err, stationStored) => {
                        if (err)
                            return res.status(500).send({ message: `Error al salvar la station: ${err}` });
                        return res.status(200).send(stationStored)
                    })
                })
            })
        })
    })
}

function getStationBikes(req, res) {
    console.log('GET /api/station/bikes/:stationId')

    let stationId = req.params.stationId

    Station.findById(stationId, (err, station) => {
        if (err)
            return res.status(500).send({ message: `Error al buscar la station: ${err}` })

        if (!station)
            return res.status(404).send({ message: `Station no existe` })

        Bike.find({ '_id': { $in: station.bikes } }, function(err, bikesList) {
            res.status(200).send(bikesList)
        })
    })
}

module.exports = {
    getStations,
    getStation,
    saveStation,
    updateStation,
    deleteStation,
    addBike,
    getStationBikes,
    removeBike
}