const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
const ElasticSearchRepository = require('./ElasticSearchRepository')
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const esIndex = require('../config/es-index')

class ElasticSearchEventRepository {

    async updateEventField(value, field, id) {

        var doc = {}
        doc[field] = value

        await client.indices.refresh({ index: esIndex.indexEvents })
        var r = await client.update({
            method: 'POST',
            index: esIndex.indexEvents,
            id: id,
            type: '_doc',
            body: {
                doc: doc
            }
        })
        return r

    }

    async updateEvent(event) {
        var isInIndex = await this.checkIsEventInIndex(event.id)

        if (isInIndex) {
            return await ElasticSearchRepository.updateEvent(event.id, esIndex.indexEvents)
        } else {
            return await ElasticSearchRepository.putNewEvent(event.id, esIndex.indexEvents)
        }

    }

    async createEvent(event) {
        return await ElasticSearchRepository.putNewEvent(event.id, esIndex.indexEvents)
    }

    async checkIsEventInIndex(id) {

        console.log(id)

        var r = await client.search({
            index: esIndex.indexEvents,
            body: {
                query: {
                    term: {
                        eid: id
                    }

                }
            }
        })
        return r.body.hits > 0

    }

}

module.exports = new ElasticSearchEventRepository()