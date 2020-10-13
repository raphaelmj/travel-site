const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const Day = require('../models/index').Day
const ElasticUpdateSearchRepository = require('./ElasticSearchUpdateRepository')
const {
    map
} = require('p-iteration');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class CriteriaRepository {


    async getCriteria() {

        var criteria = {}

        var rs = await Region.findAll()

        await map(rs, async (r, i) => {
            rs[i].dataValues.cities = await r.getCities()
            rs[i].dataValues.attractions = await r.getAttractions()
            await map(rs[i].dataValues.cities, async (c, j) => {
                rs[i].dataValues.cities[j].dataValues.attractions = await c.getAttractions()
                // console.log(c)
            })
            // rs[i].dataValues.attractions = await r.getAttractions()
        })

        criteria.regions = rs;
        criteria.cities = await City.findAll();
        criteria.attractions = await Attraction.findAll();
        criteria.themes = await Theme.findAll();
        criteria.ages = await Age.findAll()
        criteria.days = await Day.findAll()
        criteria.catalogs = await Catalog.findAll({
            where: {
                searchList: true
            },
            order: [
                ['name', 'DESC']
            ]
        })

        return criteria;

    }


    async getGeoCriteria() {

        var criteria = {}

        var rs = await Region.findAll()

        await map(rs, async (r, i) => {
            rs[i].dataValues.cities = await r.getCities()
            rs[i].dataValues.attractions = await r.getAttractions()
            await map(rs[i].dataValues.cities, async (c, j) => {
                rs[i].dataValues.cities[j].dataValues.attractions = await c.getAttractions()
                // console.log(c)
            })
            rs[i].dataValues.regionAttractions = await r.getAttractions({ where: { cityId: null } })
        })

        criteria.tree = rs;
        criteria.freeCities = await City.findAll({ where: { regionId: null } });
        criteria.freeAttractions = await Attraction.findAll(
            {
                where: {
                    [Op.and]: [{ regionId: null }, { cityId: null }]
                }
            });


        return criteria;

    }



    async createDay(data) {
        return await Day.create(data)
    }

    async updateDay(data) {
        await Day.update(data, { where: { id: data.id } })
        var day = await Day.findOne({ where: { id: data.id } })
        var d = await ElasticUpdateSearchRepository.updateEventsWhereDay(day)
        return { d }
    }

    async deleteDay(id) {
        var day = await Day.findOne({ where: { id } })
        var d = await ElasticUpdateSearchRepository.updateDeleteEventsWhereDay(day)
        return { d }
    }


    async createAge(data) {
        return await Age.create(data)
    }


    async updateAge(data) {
        await Age.update(data, { where: { id: data.id } })
        var ag = await Age.findOne({ where: { id: data.id } })
        var d = await ElasticUpdateSearchRepository.updateEventsWhereAge(ag)
        return { d }
    }


    async deleteAge(id) {
        var age = await Age.findOne({ where: { id } })
        var d = await ElasticUpdateSearchRepository.updateDeleteEventsWhereAge(age)
        return { d }
    }



    async createTheme(data) {
        return await Theme.create(data)
    }


    async updateTheme(data) {
        await Theme.update(data, { where: { id: data.id } })
        var th = await Theme.findOne({ where: { id: data.id } })
        var d = await ElasticUpdateSearchRepository.updateEventsWhereTheme(th)
        return { d }
    }

    async deleteTheme(id) {
        var th = await Theme.findOne({ where: { id } })
        var d = await ElasticUpdateSearchRepository.updateDeleteEventsWhereTheme(th)
        return { d }
    }

}


module.exports = new CriteriaRepository()