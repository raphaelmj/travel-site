const Institution = require("../../models/index").Institution
var slug = require('slug')
const {
    map
} = require('p-iteration');


class InstitutionController {

    getInstitutions(req, res) {
        Institution.findAll({ order: [['ordering', 'ASC']] }).then(s => {
            return res.json(s)
        })
    }

    update(req, res) {

        var inst = Object.assign(req.body.inst)

        if (req.image != null) {
            inst.logo = req.image;
        }

        Institution.update(inst, { where: { id: inst.id } }).then(r => {
            return res.json(r)
        })


    }

    create(req, res) {

        var inst = Object.assign(req.body.inst)

        if (req.image != null) {
            inst.logo = req.image;
        }

        Institution.findAll({ order: [['ordering', 'DESC']] }).then(prs => {
            if (prs.length) {
                inst.ordering = prs[0].ordering + 1
                Institution.create(inst).then(r => {
                    return res.json(r)
                })
            } else {
                inst.ordering = 1
                Institution.create(inst).then(r => {
                    return res.json(r)
                })
            }
        })

    }

    delete(req, res) {
        var id = req.params.id;
        Institution.destroy({
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
        InstitutionController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await Institution.update({ ordering: i }, { where: { id: s.id } })
        })
        return true
    }


    changeStatus(req, res) {
        // return res.json(req.body.status)
        InstitutionController.updateStatus(req.body.status, req.body.id).then(a => {
            return res.json({
                success: true,
                a
            })
        })
    }

    static async updateStatus(sts, id) {
        var a = await Institution.findOne({ where: { id: id } });
        a.status = sts;
        await a.save()
        return a
    }

}


module.exports = new InstitutionController()