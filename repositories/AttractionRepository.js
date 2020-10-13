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

class AttractionRepository {

    async updateAttraction(a, r, c) {
        var city = null
        var region = null
        var bool = await ValidateRepository.checkIsAliasFreeExceptStatic(a.name, 'attraction', a.id)
        // console.log(a)
        var attraction = await Attraction.findOne({ where: { id: a.id }, })

        if (c)
            city = await City.findOne({ where: { id: c.id } })

        if (r)
            var region = await Region.findOne({ where: { id: r.id } })

        if (bool) {
            attraction.name = a.name
            attraction.alias = slug(a.name, { lower: true }) + '-' + city.id
            attraction.attractionType = a.attractionType
            attraction.lat = a.lat
            attraction.lng = a.lng
        } else {
            attraction.name = a.name
            attraction.alias = slug(a.name, { lower: true })
            attraction.attractionType = a.attractionType
            attraction.lat = a.lat
            attraction.lng = a.lng
        }

        await attraction.save()

        if (region)
            await region.addAttraction(attraction)

        if (city) {
            await city.addAttraction(attraction)
        } else {
            var hasCity = await attraction.getCity()
            if (hasCity) {
                await hasCity.removeAttraction(attraction)
            }
        }



        var d = await ElasticUpdateSearchRepository.updateEventsWhereAttraction(attraction)
        var d2 = await ElasticUpdateSearchRepository.updateAttraction(attraction)

        return { d, d2 }

    }

    async createAttraction(a, r, c) {

        var city = null
        var region = null
        var bool = await ValidateRepository.checkIsAliasFreeStatic(a.name, 'attraction', a.id)

        if (c)
            city = await City.findOne({ where: { id: c.id } })

        if (r)
            var region = await Region.findOne({ where: { id: r.id } })


        if (bool) {
            var attraction = await Attraction.create(a)
            var alias = slug(a.name) + '-' + attraction.id
            attraction.alias = alias
            await attraction.save()
        } else {
            a.alias = slug(a.name)
            var attraction = await Attraction.create(a)
        }


        if (region)
            await region.addAttraction(attraction)

        if (city)
            await city.addAttraction(attraction)

        var d = await ElasticUpdateSearchRepository.createAttraction(attraction)
        return { attraction, d }

    }

    async deleteAttraction(id) {
        var attraction = await Attraction.findOne({ where: { id } })
        var d = await ElasticUpdateSearchRepository.updateDeleteEventsWhereAttraction(attraction)
        var d2 = await ElasticUpdateSearchRepository.deleteAttraction(id)
        // return { d, d2 }
    }

}


module.exports = new AttractionRepository()