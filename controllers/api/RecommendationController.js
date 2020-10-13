const Recomendation = require("../../models/index").Recomendation
var slug = require('slug')
const {
    map
} = require('p-iteration');


class RecommendationController {

    getRec(req, res) {
        Recomendation.findAll({ order: [['ordering', 'DESC']] }).then(s => {
            return res.json(s)
        })
    }

    update(req, res) {

        var reco = Object.assign(req.body.reco)

        if (req.image != null) {
            reco.image = req.image;
        }

        Recomendation.update(reco, { where: { id: reco.id } }).then(r => {
            return res.json(r)
        })


    }

    create(req, res) {

        var reco = Object.assign(req.body.reco)

        if (req.image != null) {
            reco.image = req.image;
        }

        Recomendation.findAll({ order: [['ordering', 'DESC']] }).then(prs => {
            if (prs.length) {
                reco.ordering = prs[0].ordering + 1
                Recomendation.create(reco).then(r => {
                    return res.json(r)
                })
            } else {
                reco.ordering = 1
                Recomendation.create(reco).then(r => {
                    return res.json(r)
                })
            }
        })

    }

    delete(req, res) {
        var id = req.params.id;
        Recomendation.destroy({
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
        RecommendationController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await Recomendation.update({ ordering: prms.length - i }, { where: { id: s.id } })
        })
        return true
    }


    changeStatus(req, res) {
        // return res.json(req.body.status)
        RecommendationController.updateStatus(req.body.status, req.body.id).then(a => {
            return res.json({
                success: true,
                a
            })
        })
    }

    static async updateStatus(sts, id) {
        var a = await Recomendation.findOne({ where: { id: id } });
        a.status = sts;
        await a.save()
        return a
    }

}


module.exports = new RecommendationController()