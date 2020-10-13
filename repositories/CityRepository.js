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

class CityRepository {

    async updateCity(c, regionId) {
        var bool = await ValidateRepository.checkIsAliasFreeExceptStatic(c.name, 'city', c.id)
        var city = await City.findOne({ where: { id: c.id } })
        var region = await Region.findOne({ where: { id: regionId } })

        if (bool) {
            city.name = c.name
            city.alias = slug(c.name, { lower: true }) + '-' + city.id
            city.lat = c.lat
            city.lng = c.lng
        } else {
            city.name = c.name
            city.alias = slug(c.name, { lower: true })
            city.lat = c.lat
            city.lng = c.lng
        }

        await city.save()
        await region.addCity(city)
        var d = await ElasticUpdateSearchRepository.updateEventsWhereCity(city)
        var d2 = await ElasticUpdateSearchRepository.updateCity(city)

        return { d, d2 }

    }

    async createCity(c, regionId) {

        var bool = await ValidateRepository.checkIsAliasFreeStatic(c.name, 'city')
        var region = await Region.findOne({ where: { id: regionId } })

        if (bool) {
            var city = await City.create(c)
            var alias = slug(c.name) + '-' + city.id
            city.alias = alias
            await city.save()

        } else {
            c.alias = slug(c.name)
            var city = await City.create(c)
        }

        await region.addCity(city);
        var d = await ElasticUpdateSearchRepository.createCity(city)

        return { city, d }

    }

    async deleteCity(id) {
        var city = await City.findOne({ where: { id } })
        var d = await ElasticUpdateSearchRepository.updateDeleteEventsWhereCity(city)
        var d2 = await ElasticUpdateSearchRepository.deleteCity(id)
        return { d, d2 }
    }

}


module.exports = new CityRepository()