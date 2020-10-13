const EventRepository = require('../../repositories/EventRepository')
const Event = require('../../models/index').Event
const ValidateRepository = require('../../repositories/ValidateRepository')

class EventController {

    findEventByNumber(req, res) {
        // console.log(req.query.phrase)
        EventRepository.findEventByNumberEs(req.query.phrase).then(r => {
            return res.json(r)
        })

    }

    getEventsByQuery(req, res) {
        EventRepository.eventsGet(req.body.qp, req.body.catalogId).then(r => {
            return res.json(r)
        })
    }

    updateField(req, res) {
        EventRepository.updateField(req.body.value, req.body.field, req.params.id).then(r => {
            return res.json(r)
        })
    }

    getFullEvent(req, res) {
        EventRepository.getFullEventData(req.params.id).then(r => {
            return res.json(r)
        })
    }


    fullUpdateEvent(req, res) {
        EventRepository.updateEvent(req.body).then(r => {
            return res.json(r)
        })
    }

    createEvent(req, res) {
        EventRepository.createEvent(req.body).then(r => {
            return res.json(r)
        })
    }


    checkIsNumberFree(req, res) {

        ValidateRepository.checkIsNumberEventFree(req.body.value, req.body.isNew, req.body.eventId).then(bool => {
            return res.json(bool)
        })
    }

}

module.exports = new EventController()