const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const Day = require('../models/index').Day
const ValidateRepository = require('./ValidateRepository')
const ElasticUpdateSearchRepository = require('./ElasticSearchUpdateRepository')
const {
    map
} = require('p-iteration');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const slug = require('slug')

class RegionRepository {

    async createRegion(r) {

        var bool = await ValidateRepository.checkIsAliasFreeStatic(r.name, 'region')
        if (bool) {
            var nr = await Region.create(r)
            nr.alias = slug(r.name, { lower: true }) + '-' + nr.id
            await nr.save()
        } else {
            r.alias = slug(r.name, { lower: true })
            var nr = await Region.create(r)
        }

        return nr

    }

    async updateRegion(r) {

        var bool = await ValidateRepository.checkIsAliasFreeExceptStatic(r.name, 'region', r.id)

        var region = await Region.findOne({ where: { id: r.id } })

        if (bool) {
            region.name = r.name
            region.alias = slug(r.name, { lower: true }) + '-' + r.id
            region.lat = r.lat
            region.lng = r.lng
        } else {
            region.name = r.name
            region.alias = slug(r.name, { lower: true })
            region.lat = r.lat
            region.lng = r.lng
        }

        await region.save()
        var d = await ElasticUpdateSearchRepository.updateEventsWhereRegion(region)

        return { d }
    }


    async getRegionCities(id) {
        var r = await Region.findOne({ where: { id } })
        return await r.getCities()
    }

    async getRegionAttractions(id) {
        var r = await Region.findOne({ where: { id } })
        return await r.getAttractions()
    }

}


module.exports = new RegionRepository()