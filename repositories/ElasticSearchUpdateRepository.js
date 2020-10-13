const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Day = require('../models/index').Day
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const esIndex = require('../config/es-index')

class ElasticSearchUpdateSearchRepository {


    async updateEventsWhereCity(c) {

        var c = await City.findOne({ where: { id: c.id } })
        var events = await c.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var cities = await ev.getCities()

            var r = await this.updateEventCity(ev.id, cities)
            rs.push(r)
        })

        return rs

    }

    async updateDeleteEventsWhereCity(city) {

        var c = await City.findOne({ where: { id: city.id } })
        var events = await c.getEvents()
        await City.destroy({
            where: {
                id: city.id
            }
        })
        var rs = []
        await map(events, async (ev, i) => {
            var cities = await ev.getCities()
            var r = await this.updateEventCity(ev.id, cities)
            rs.push(r)
        })

        return rs

    }

    async updateEventCity(eventId, cities) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var cs = cities.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    cities: cs
                }
            }
        })
        return r
    }

    async checkIsDocExist(id) {
        var r = await client.get({
            index: esIndex.indexEvents,
            type: '_doc',
            id
        })
        return r
    }

    async updateCity(city) {

        await client.indices.refresh({ index: esIndex.indexPoints })
        var { name, alias, lat, lng } = city

        var r = await client.update({
            method: 'POST',
            index: esIndex.indexPoints,
            id: 'city_' + city.id,
            type: '_doc',
            body: {
                doc: {
                    name,
                    alias,
                    lat,
                    lng
                }
            }
        })
        return r
    }


    async createCity(city) {

        await client.indices.refresh({ index: esIndex.indexPoints })
        var { id, name, alias, lat, lng } = city

        var r = await client.index({
            method: 'PUT',
            index: esIndex.indexPoints,
            id: 'city_' + city.id,
            type: '_doc',
            body: {
                id,
                name,
                alias,
                lat,
                lng,
                localType: "city",
                baseType: "city"
            }
        })
        return r
    }


    async deleteCity(cid) {

        await client.indices.refresh({ index: esIndex.indexPoints })

        var r = await client.delete({
            method: 'DELETE',
            index: esIndex.indexPoints,
            id: 'city_' + cid,
            type: '_doc'
        })
        return r
    }


    async updateEventsWhereAttraction(a) {

        var at = await Attraction.findOne({ where: { id: a.id } })
        var events = await at.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var attrs = await ev.getAttractions()
            var r = await this.updateEventAttraction(ev.id, attrs)
            rs.push(r)
        })

        return rs

    }


    async updateEventAttraction(eventId, attr) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var ats = attr.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng, attractionType: r.attractionType } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    attractions: ats
                }
            }
        })
        return r
    }

    async updateAttraction(attraction) {

        await client.indices.refresh({ index: esIndex.indexPoints })
        var { name, alias, lat, lng, attractionType } = attraction

        var r = await client.update({
            method: 'POST',
            index: esIndex.indexPoints,
            id: 'attraction_' + attraction.id,
            type: '_doc',
            body: {
                doc: {
                    name,
                    alias,
                    lat,
                    lng,
                    attractionType
                }
            }
        })
        return r
    }


    async createAttraction(a) {

        await client.indices.refresh({ index: esIndex.indexPoints })
        var { id, name, alias, lat, lng, attractionType } = a

        var r = await client.index({
            method: 'PUT',
            index: esIndex.indexPoints,
            id: 'attraction_' + a.id,
            type: '_doc',
            body: {
                id,
                name,
                alias,
                lat,
                lng,
                localType: attractionType,
                baseType: "attraction"
            }
        })
        return r
    }


    async updateDeleteEventsWhereAttraction(attraction) {
        var a = await Attraction.findOne({ where: { id: attraction.id } })
        var events = await a.getEvents()
        await Attraction.destroy({
            where: {
                id: attraction.id
            }
        })
        var rs = []
        await map(events, async (ev, i) => {
            var attr = await ev.getAttractions()
            var r = await this.updateEventAttraction(ev.id, attr)
            rs.push(r)
        })

        return rs
    }


    async deleteAttraction(id) {
        await client.indices.refresh({ index: esIndex.indexPoints })

        var r = await client.delete({
            method: 'DELETE',
            index: esIndex.indexPoints,
            id: 'attraction_' + id,
            type: '_doc'
        })
        return r
    }


    async updateEventsWhereRegion(r) {

        var r = await Region.findOne({ where: { id: r.id } })
        var events = await r.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var regions = await ev.getRegions()
            var r = await this.updateEventRegion(ev.id, regions)
            rs.push(r)
        })

        return rs

    }

    async updateEventRegion(eventId, regions) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var rs = regions.map(r => { return { id: r.id, name: r.name, alias: r.alias, lat: r.lat, lng: r.lng } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    regions: rs
                }
            }
        })
        return r
    }



    async updateEventsWhereDay(d) {

        var day = await Day.findOne({ where: { id: d.id } })
        var events = await day.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var days = await ev.getDays()
            var r = await this.updateEventDay(ev.id, days)
            rs.push(r)
        })

        return rs

    }

    async updateDeleteEventsWhereDay(day) {

        var day = await Day.findOne({ where: { id: day.id } })
        var events = await day.getEvents()
        await Day.destroy({
            where: {
                id: day.id
            }
        })
        var rs = []
        await map(events, async (ev, i) => {
            var days = await ev.getDays()
            var r = await this.updateEventDay(ev.id, days)
            rs.push(r)
        })

        return rs

    }


    async updateEventDay(eventId, days) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var ds = days.map(r => { return { id: r.id, daysNumber: r.daysNumber } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    days: ds
                }
            }
        })
        return r
    }



    async updateEventsWhereAge(ag) {

        var age = await Age.findOne({ where: { id: ag.id } })
        var events = await age.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var ages = await ev.getAges()
            var r = await this.updateEventAge(ev.id, ages)
            rs.push(r)
        })

        return rs

    }

    async updateDeleteEventsWhereAge(age) {

        var ag = await Age.findOne({ where: { id: age.id } })
        var events = await ag.getEvents()
        await Age.destroy({
            where: {
                id: age.id
            }
        })
        var rs = []
        await map(events, async (ev, i) => {
            var ages = await ev.getAges()
            var r = await this.updateEventAge(ev.id, ages)
            rs.push(r)
        })

        return rs

    }


    async updateEventAge(eventId, ages) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var ags = ages.map(r => { return { id: r.id, from: r.from, to: r.to } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    ages: ags
                }
            }
        })
        return r
    }







    async updateEventsWhereTheme(th) {

        var theme = await Theme.findOne({ where: { id: th.id } })
        var events = await theme.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var themes = await ev.getThemes()
            var r = await this.updateEventTheme(ev.id, themes)
            rs.push(r)
        })

        return rs

    }

    async updateDeleteEventsWhereTheme(th) {

        var thm = await Theme.findOne({ where: { id: th.id } })
        var events = await thm.getEvents()
        await Theme.destroy({
            where: {
                id: th.id
            }
        })
        var rs = []
        await map(events, async (ev, i) => {
            var themes = await ev.getThemes()
            var r = await this.updateEventTheme(ev.id, themes)
            rs.push(r)
        })

        return rs

    }


    async updateEventTheme(eventId, themes) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        var ths = themes.map(r => { return { id: r.id, name: r.name } })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    themes: ths
                }
            }
        })
        return r
    }


    async updateEventsWhereCatalog(cId) {

        var c = await Catalog.findOne({ where: { id: cId } })
        var events = await c.getEvents()

        var rs = []
        await map(events, async (ev, i) => {
            var r = await this.updateEventCatalog(ev.id, c)
            rs.push(r)
        })

        return rs

    }


    async updateEventCatalog(eventId, catalog) {

        await client.indices.refresh({ index: esIndex.indexEvents })
        // console.log(cs)
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: eventId,
            type: '_doc',
            body: {
                doc: {
                    catalogName: catalog.name
                }
            }
        })
        return r
    }

}

module.exports = new ElasticSearchUpdateSearchRepository()