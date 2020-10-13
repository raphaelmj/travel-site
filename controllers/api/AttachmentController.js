const Attachment = require("../../models/index").Attachment
var slug = require('slug')
const {
    map
} = require('p-iteration');


class AttachmentController {

    getAttachments(req, res) {
        Attachment.findAll({ order: [['ordering', 'ASC']] }).then(s => {
            return res.json(s)
        })
    }

    update(req, res) {

        var promo = Object.assign(req.body.attachment)

        Attachment.update(promo, { where: { id: promo.id } }).then(r => {
            return res.json(r)
        })


    }

    create(req, res) {

        var promo = Object.assign(req.body.attachment)

        Attachment.findAll({ order: [['ordering', 'DESC']] }).then(prs => {
            if (prs.length) {
                promo.ordering = prs[0].ordering + 1
                Attachment.create(promo).then(r => {
                    return res.json(r)
                })
            } else {
                promo.ordering = 1
                Attachment.create(promo).then(r => {
                    return res.json(r)
                })
            }
        })

    }

    delete(req, res) {
        var id = req.params.id;
        Attachment.destroy({
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
        AttachmentController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await Attachment.update({ ordering: i }, { where: { id: s.id } })
        })
        return true
    }


    changeStatus(req, res) {
        // return res.json(req.body.status)
        AttachmentController.updateStatus(req.body.status, req.body.id).then(a => {
            return res.json({
                success: true,
                a
            })
        })
    }

    static async updateStatus(sts, id) {
        var a = await Attachment.findOne({ where: { id: id } });
        a.status = sts;
        await a.save()
        return a
    }

}


module.exports = new AttachmentController()