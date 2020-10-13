const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
var limit = require('../config/limit')
const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const fs = require('fs');


class ElasticSearchRepository {

    async putNewEvent(id, indexName) {

        var ev = await Event.findOne({ where: { id } });

        // console.log(a);
        // return
        if (ev) {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias", "lat", "lng", "attractionType"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", "daysNumber"],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = ev.priceConfig
            if (typeof ev.priceConfig == 'string') {
                priceConfig = JSON.parse(ev.priceConfig)
            }

            // var mG = ev.microGallery
            // if (typeof ev.microGallery != 'string') {
            //     mG = JSON.stringify(mG)
            // }


            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                atSezon: Boolean(ev.atSezon),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            // console.log(nevent)


            return await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: ev.id,
                body: nevent
            })

        } else {
            return { error: 'event_not_found' }
        }
    }

    async updateEvent(id, indexName) {

        var ev = await Event.findOne({ where: { id } });

        // console.log(a);
        // return
        if (ev) {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias", "lat", "lng", "attractionType"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", "daysNumber"],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)

            var priceConfig = ev.priceConfig
            if (typeof ev.priceConfig == 'string') {
                priceConfig = JSON.parse(ev.priceConfig)
            }

            // var mG = ev.microGallery
            // if (typeof ev.microGallery != 'string') {
            //     mG = JSON.stringify(mG)
            // }



            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                atSezon: Boolean(ev.atSezon),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            // console.log(nevent)


            return await client.update({
                method: 'POST',
                index: indexName,
                type: '_doc',
                id,
                body: {
                    doc: nevent
                }
            })

        } else {
            return { error: 'event_not_found' }
        }

    }


    async searchEvents(query, indexName) {

        var from = 0;
        if (query.page && query.page != 1) {
            from = (query.page - 1) * limit.indexLimit
        }

        return await ElasticAdvancedSearchRepository.findEvents(query, indexName, limit.indexLimit, from)
    }

    async searchCatalogIndexByType(type, catalogId, all, from, size, indexName) {

        return await ElasticAdvancedSearchRepository.findCatalogTypeEventsByAvl(type, catalogId, all, from, size, indexName)

    }

    async getSezonCatalogEvents(indexName) {
        var catalog = await Catalog.findOne({ where: { current: true } })
        return await ElasticAdvancedSearchRepository.findSezonEventsFromCatalog(catalog, indexName)
    }

    async searchEventsByNumber(phrase, indexName) {

        await client.indices.refresh({ index: indexName })
        const { body } = await client.search({
            index: indexName,
            body: {
                from: 0,
                size: 1000,
                query: {
                    prefix: {
                        number: {
                            value: phrase.toLowerCase()
                        }
                    }
                }
            }
        })

        return body.hits.hits
    }

    async findPointByPhrase(phrase) {
        await client.indices.refresh({ index: 'points' })
        const { body } = await client.search({
            index: 'points',
            body: {
                from: 0,
                size: 1000,
                query: {
                    match_phrase_prefix: {
                        name: phrase
                    }
                }
            }
        })

        return body.hits.hits
    }




    // async searchIndex

    // ?regions=&cities=2&attractions=&themes=&ages=&days=&status=all&type=all&order=default&catalog=2&page=1

    // async getAllArticles(from, size) {

    //     await client.indices.refresh({ index: 'emancypantki' })
    //     const { body } = await client.search({
    //         index: 'emancypantki',
    //         body: {
    //             from,
    //             size,
    //             query: {
    //                 match_all: {}
    //             }
    //         }
    //     })

    //     return body

    // }

    // async searchArticles(phrase, from, size) {

    //     await client.indices.refresh({ index: 'emancypantki' })
    //     const { body } = await client.search({
    //         index: 'emancypantki',
    //         body: {
    //             from,
    //             size,
    //             query: {
    //                 match_phrase_prefix: { content: phrase }
    //             },
    //             highlight: {
    //                 fields: {
    //                     content: { "pre_tags": ["<b>"], "post_tags": ["</b>"] }
    //                 }
    //             }
    //         }
    //     })

    //     return body

    // }

    async getEventByIndexId(id) {

        await client.indices.refresh({ index: 'wirtur' })
        const { body } = await client.get({
            index: 'wirtur',
            type: '_doc',
            id,

        })

        return body

    }


    async deleteCreateIndexMapping(indexName) {

        var existsBool = await client.indices.exists({ index: indexName })

        if (existsBool.body) {
            await client.indices.delete({
                index: indexName
            })
        }

        await client.indices.create({
            index: indexName
        })



        return await client.indices.putMapping({
            index: indexName,
            //for =<6.8.8
            type: '_doc',
            body: {
                properties: {
                    eid: { "type": "integer" },
                    catalogId: { "type": "integer" },
                    catalogName: { "type": "text" },
                    link: { "type": "text" },
                    name: { "type": "text" },
                    alias: { "type": "text" },
                    number: { "type": "text" },
                    image: { "type": "text" },
                    startAt: { "type": "date" },
                    endAt: { "type": "date" },
                    atSezon: { "type": "boolean" },
                    eventType: { "type": "text" },
                    eventSezonType: { "type": "text" },
                    daysTotal: { "type": "integer" },
                    smallDesc: { "type": "text" },
                    longDesc: { "type": "text" },
                    status: { "type": "text" },
                    microGallery: {
                        properties: {
                            image: { "type": "text" },
                            height: { "type": "integer" },
                            width: { "type": "integer" },
                            sizString: { "type": "text" },
                        }
                    },
                    daysMin: { "type": "integer" },
                    daysMax: { "type": "integer" },
                    content: {
                        type: "text",
                        "analyzer": "polish"
                    },
                    days: {
                        properties: {
                            id: { "type": "integer" },
                            daysNumber: { "type": "integer" },
                        }
                    },
                    regions: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" },
                            lat: { "type": "double" },
                            lng: { "type": "double" }
                        }
                    },
                    cities: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" },
                            lat: { "type": "double" },
                            lng: { "type": "double" }
                        }
                    },
                    attractions: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" },
                            attractionType: { "type": "text" },
                            lat: { "type": "double" },
                            lng: { "type": "double" }
                        }
                    },
                    themes: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" }
                        }
                    },
                    ages: {
                        properties: {
                            id: { "type": "integer" },
                            from: { "type": "integer" },
                            to: { "type": "integer" }
                        }
                    },
                    // priceConfig: {
                    //     properties: {
                    //         price: { "type": "double" },
                    //         from: { "type": "integer" },
                    //         to: { "type": "integer" },
                    //         days: { "type": "integer" }
                    //     }
                    // },
                    priceConfig: {
                        properties: {
                            groupName: { type: "text" },
                            groupDesc: { type: "text" },
                            prices: {
                                properties: {
                                    price: { "type": "double" },
                                    from: { "type": "integer" },
                                    to: { "type": "integer" },
                                    days: { "type": "integer" }
                                }
                            }

                        }
                    },
                    priceBrutto: { "type": "double" }
                }
            }
        })
    }

    async deleteCreateIndexPointsMapping(indexName) {

        var existsBool = await client.indices.exists({ index: indexName })

        if (existsBool.body) {
            await client.indices.delete({
                index: indexName
            })
        }

        await client.indices.create({
            index: indexName
        })



        return await client.indices.putMapping({
            index: indexName,
            //for =<6.8.8
            type: '_doc',
            body: {
                properties: {
                    pid: { "type": "integer" },
                    name: { "type": "text", analyzer: "polish" },
                    alias: { "type": "text" },
                    localType: { "type": "text" },
                    baseType: { "type": "text" },
                    lat: { "type": "double" },
                    lng: { "type": "double" }
                }
            }
        })
    }

    async indexAllEvents(indexName) {

        var events = await this.prepareAllEventsForIndex()


        await map(events, async (ev, i) => {

            await client.indices.refresh({ index: indexName })

            await client.indices.putSettings({
                index: indexName,
                body: {
                    "index.blocks.read_only_allow_delete": null
                }
            })

            await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: ev.eid,
                body: ev
            })
        })
    }


    async indexAllPoints(indexName) {

        var points = await this.prepareAllPointsForIndex()

        // await client.indices.putSettings({
        //     index: indexName,
        //     body: {
        //         "index.blocks.read_only_allow_delete": null
        //     }
        // })

        await client.indices.putSettings({
            index: indexName,
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        await map(points, async (p, i) => {
            await client.indices.refresh({ index: indexName })
            await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: p.baseType + '_' + p.id,
                body: p
            })
        })
    }


    async indexNewEvent(indexName, id) {

        var event = await this.prepareEventForIndex(id)

        // fs.writeFileSync('../commands/test' + id + '.json', JSON.stringify(event))

        await client.indices.refresh({ index: indexName })

        await client.indices.putSettings({
            index: indexName,
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        await client.index({
            method: 'PUT',
            index: indexName,
            type: '_doc',
            id: event.eid,
            body: event
        })

    }


    async indexSkipTakeEvents(indexName, offset, limit) {

        var events = await this.prepareSkipTakeEventsForIndex(offset, limit)

        await client.indices.putSettings({
            index: indexName,
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        // console.log(events)

        await map(events, async (ev, i) => {



            await client.indices.refresh({ index: indexName })

            await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: ev.eid,
                body: ev
            })
            // console.log(ev.number)
        })
    }

    async prepareAllEventsForIndex() {

        var evnsData = [];

        var evns = await Event.findAll({
            where: {

            }
        })


        await map(evns, async (ev, i) => {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias", "lat", "lng", "attractionType"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", 'daysNumber'],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = ev.priceConfig

            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                atSezon: Boolean(ev.atSezon),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                microGallery: ev.microGallery,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            evnsData.push(nevent)

        })

        return evnsData;
    }


    async prepareAllPointsForIndex() {

        var pointsData = [];

        var cities = await City.findAll({})
        var attractions = await Attraction.findAll({})

        await map(cities, async (c, i) => {

            pointsData.push({
                id: c.id,
                name: c.name,
                alias: c.alias,
                localType: 'city',
                baseType: 'city',
                lat: c.lat,
                lng: c.lng
            })

        })

        await map(attractions, async (a, i) => {

            pointsData.push({
                id: a.id,
                name: a.name,
                alias: a.alias,
                localType: a.attractionType,
                baseType: 'attraction',
                lat: a.lat,
                lng: a.lng
            })

        })

        return pointsData

    }


    async prepareSkipTakeEventsForIndex(offset, limit) {

        var evnsData = [];

        var evns = await Event.findAll({
            where: {

            },
            offset: offset,
            limit: limit
        })

        await map(evns, async (ev, i) => {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias", "lat", "lng"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias", "lat", "lng", "attractionType"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", 'daysNumber'],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = ev.priceConfig

            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                atSezon: Boolean(ev.atSezon),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            evnsData.push(nevent)

        })

        return evnsData;
    }


    async prepareEventForIndex(id) {

        var ev = await Event.findOne({
            where: { id: id }
        })



        ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
        ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias", "lat", "lng"] })
        ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias", "lat", "lng"] })
        ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias", "lat", "lng", "attractionType"] })
        ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
        ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
        ev.dataValues.days = await ev.getDays({
            attributes: ["id", 'daysNumber'],
            order: [[
                'daysNumber', 'asc'
            ]]
        })
        var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
        var priceConfig = ev.priceConfig

        var nevent = {
            eid: ev.id,
            catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
            catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
            link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
            name: ev.name,
            alais: ev.alias,
            number: ev.number,
            image: ev.image,
            startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
            endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
            atSezon: Boolean(ev.atSezon),
            eventType: ev.eventType,
            eventSezonType: ev.eventSezonType,
            smallDesc: ev.smallDesc,
            longDesc: ev.longDesc,
            status: ev.status,
            daysMin: daysBorder.min,
            daysMax: daysBorder.max,
            microGallery: ev.microGallery,
            content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
            days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
            regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
            cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } }),
            attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } }),
            themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
            ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
            priceConfig: priceConfig,
            priceBrutto: parseFloat(ev.priceBrutto)
        }


        return nevent
    }


    static mergeEventContent(intro, content) {
        var str = '';

        if (intro) {
            str += intro.replace(/(<([^>]+)>)/ig, "");
            // str += intro
        }
        if (content) {
            str += ' ' + content.replace(/(<([^>]+)>)/ig, "");
            // str += content
        }

        return str
    }

    static findMinAndMaxDays(days) {
        var daysBorder = {
            min: null,
            max: null
        }
        if (days) {
            if (days.lenght > 1) {
                daysBorder.min = days[0].daysNumber
                daysBorder.max = days[days.lenght - 1].daysNumber
            } else if (days.lenght == 1) {
                daysBorder.min = days[0].daysNumber
                daysBorder.max = days[0].daysNumber
            }
        }

        return daysBorder
    }

}


module.exports = new ElasticSearchRepository()
