const Partner = require("../../models/index").Partner
var slug = require('slug')
const {
    map
} = require('p-iteration');


class PartnerController {

    getPartners(req, res) {
        Partner.findAll({ order: [['ordering', 'ASC']] }).then(s => {
            return res.json(s)
        })
    }

    update(req, res) {

        var hp = Object.assign(req.body.partner)

        if (req.image != null) {
            hp.image = req.image;
        }

        Partner.update(hp, { where: { id: hp.id } }).then(r => {
            return res.json(r)
        })


    }

    create(req, res) {

        var hp = Object.assign(req.body.partner)

        if (req.image != null) {
            hp.image = req.image;
        }

        Partner.findAll({ order: [['ordering', 'DESC']] }).then(prs => {
            if (prs.length) {
                hp.ordering = prs[0].ordering + 1
                Partner.create(hp).then(r => {
                    return res.json(r)
                })
            } else {
                hp.ordering = 1
                Partner.create(hp).then(r => {
                    return res.json(r)
                })
            }
        })

    }

    delete(req, res) {
        var id = req.params.id;
        Partner.destroy({
            where: {
                id: id
            }
        }).then(function (r) {
            return res.json({
                success: true,
                r
            })
        });
    }

    changeOrder(req, res) {
        PartnerController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await Partner.update({ ordering: i }, { where: { id: s.id } })
        })
        return true
    }


}


module.exports = new PartnerController()