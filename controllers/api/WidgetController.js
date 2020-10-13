const Widget = require("../../models/index").Widget
var slug = require('slug')
const {
    map
} = require('p-iteration');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;


class WidgetController {

    getWidgets(req, res) {
        Widget.findAll().then(ws => {
            return res.json(ws)
        })
    }

    getWidgetsGroup(req, res) {
        Widget.findAll().then(ws => {
            var group = WidgetController.groupByAlias(ws)
            return res.json(group)
        })
    }

    updateWidget(req, res) {
        Widget.update({ data: req.body.widget.data }, { where: { id: req.body.widget.id } }).then(r => {
            return res.json(r)
        })
    }

    updateWidgetCert(req, res) {

        if (req.image) {
            Widget.update({ data: { image: req.image } }, { where: { id: req.body.widget.id } }).then(r => {
                return res.json(r)
            })
        } else {
            return res.json(req.body)
        }

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


module.exports = new WidgetController()