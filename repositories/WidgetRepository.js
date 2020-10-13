var Widget = require('../models/index').Widget;
const arraySort = require('array-sort');
const slug = require('slug')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');



class WidgetRepository {

    async getWidgetsGroup() {
        var ws = await Widget.findAll()
        var group = WidgetRepository.groupByAlias(ws)
        return group
    }


    static groupByAlias(ws) {
        var group = {}
        ws.map(w => {
            if (!group.hasOwnProperty(w.targetAlias)) {
                group[w.targetAlias] = w
            }
        })
        return group
    }

}


module.exports = new WidgetRepository()