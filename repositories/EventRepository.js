var Link = require('../models/index').Link;
var Content = require('../models/index').Content;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
var Region = require('../models/index').Region;
var Doc = require('../models/index').Doc;
var Docdata = require('../models/index').Docdata;
var City = require('../models/index').City;
var Theme = require('../models/index').Theme;
var Event = require('../models/index').Event;
var Age = require('../models/index').Age;
var Day = require('../models/index').Day;
var Attraction = require('../models/index').Attraction
var Catalog = require('../models/index').Catalog;
var Article = require('../models/index').Article;
var Slide = require('../models/index').Slide;
var HomePage = require('../models/index').HomePage;
var Partner = require('../models/index').Partner;
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchEventRepository = require('./ElasticSearchEventRepository')
const ValidateRepository = require('./ValidateRepository')
const Op = Sequelize.Op;
const fs = require('fs');
const slug = require('slug');
const {
    map
} = require('p-iteration');
var moment = require('moment');


class EventRepository {

    async findEventByNumberEs(phrase) {
        console.log(phrase)
        return await ElasticSearchRepository.searchEventsByNumber(phrase, 'wirtur')
    }

    async eventsGet(query, catalogId) {


        var where = []

        var limit = (query.limit) ? query.limit : 20
        limit = parseInt(limit)
        var page = (query.page) ? query.page : 1
        page = parseInt(page)
        var status = (query.status) ? query.status : 'all'
        var sezon = (query.sezon) ? query.sezon : 'all'
        var type = (query.type) ? query.type : 'all'


        var offset = 0;
        if (page && page != 1) {
            offset = (page - 1) * limit;
            offset--
        }

        if (status != 'all') {
            where.push({ status })
        }

        if (sezon != 'all') {
            where.push({ eventSezonType: sezon })
        }

        if (type != 'all') {
            where.push({ eventType: type })
        }

        if (query.numberPhrase) {
            where.push({
                number: {
                    [Op.substring]: query.numberPhrase
                }
            })
        }

        var cIdString = String(catalogId)
        if (/^[0-9]+$/gm.test(cIdString)) {
            where.push({ catalogId })
        } else {
            where.push({ catalogId: null })
        }


        var events = await Event.findAndCountAll({
            where: {
                [Op.and]: where
            },
            order: [
                ['createdAt', 'ASC']
            ],
            include: [
                // { model: Age, as: 'Ages' },
                { model: Day, as: 'Days' }
            ],
            offset,
            limit,
            distinct: true
        })

        var catalog = await Catalog.findOne({ where: { id: catalogId } })

        return { qp: query, catalog, events: events.rows, total: events.count }
    }

    async updateField(value, field, id) {
        var event = await Event.findOne({ where: { id } })
        // console.log(event)
        event[field] = value
        await event.save()
        var d = await ElasticSearchEventRepository.updateEventField(value, field, id)
        return { event, d }
    }

    async getFullEventData(id) {
        return await Event.findOne({
            where: { id },
            include: [
                {
                    model: Catalog,
                    as: 'catalog'
                },
                {
                    model: Region,
                    as: 'Regions'
                },
                {
                    model: City,
                    as: 'Cities'
                },
                {
                    model: Attraction,
                    as: 'Attractions'
                },
                {
                    model: Day,
                    as: 'Days'
                },
                {
                    model: Age,
                    as: 'Ages'
                },
                {
                    model: Theme,
                    as: 'Themes'
                }
            ]
        })
    }

    async updateEvent(eventData) {

        var bool = await ValidateRepository.checkIsAliasFreeExceptStatic(eventData.name, 'event', eventData.id)

        if (bool) {

            eventData.alias = slug(eventData.name, { lower: true }) + eventData.id

        } else {

            eventData.alias = slug(eventData.name, { lower: true })

        }

        await Event.update(eventData, { where: { id: eventData.id } })


        var event = await Event.findOne({ where: { id: eventData.id } })
        await this.updateAges(eventData, event)
        await this.updateThemes(eventData, event)
        await this.updateDays(eventData, event)
        await this.updateRegions(eventData, event)
        await this.updateCities(eventData, event)
        await this.updateAttractions(eventData, event)


        var d = await ElasticSearchEventRepository.updateEvent(event)

        return { d, bool, eventData }
    }


    async createEvent(eventData) {

        var bool = await ValidateRepository.checkIsAliasFreeStatic(eventData.name, 'event')

        if (bool) {

            var event = await Event.create(eventData)
            event.alias = slug(eventData.name, { lower: true }) + event.id
            await event.save()

        } else {

            eventData.alias = slug(eventData.name, { lower: true })
            var event = await Event.create(eventData)

        }


        await this.updateAges(eventData, event)
        await this.updateThemes(eventData, event)
        await this.updateDays(eventData, event)
        await this.updateRegions(eventData, event)
        await this.updateCities(eventData, event)
        await this.updateAttractions(eventData, event)

        var d = await ElasticSearchEventRepository.createEvent(event)

        return { d, bool, eventData }
    }




    async updateAges(eventData, event) {

        var assocs = await event.getAges()
        await event.removeAges(assocs)
        await map(eventData.Ages, async (el, i) => {

            await event.addAge(el.id)

        })

    }

    async updateThemes(eventData, event) {

        var assocs = await event.getThemes()
        await event.removeThemes(assocs)
        await map(eventData.Themes, async (el, i) => {

            await event.addTheme(el.id)

        })

    }

    async updateDays(eventData, event) {

        var assocs = await event.getDays()
        await event.removeDays(assocs)
        await map(eventData.Days, async (el, i) => {

            await event.addDay(el.id)

        })

    }

    async updateRegions(eventData, event) {

        var assocs = await event.getRegions()
        await event.removeRegions(assocs)
        await map(eventData.Regions, async (el, i) => {

            await event.addRegion(el.id)

        })

    }

    async updateCities(eventData, event) {

        var assocs = await event.getCities()
        await event.removeCities(assocs)
        await map(eventData.Cities, async (el, i) => {

            await event.addCity(el.id)

        })

    }


    async updateAttractions(eventData, event) {

        var assocs = await event.getAttractions()
        await event.removeAttractions(assocs)
        await map(eventData.Attractions, async (el, i) => {

            await event.addAttraction(el.id)

        })

    }

}

module.exports = new EventRepository()