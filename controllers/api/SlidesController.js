const Slide = require("../../models/index").Slide
var slug = require('slug')
const {
    map
} = require('p-iteration');


class SlidesController {

    getSlides(req, res) {
        Slide.findAll({ order: [['ordering', 'ASC']] }).then(s => {
            return res.json(s)
        })
    }

    updateSlide(req, res) {

        var slide = Object.assign(req.body.slide)

        if (req.image != null) {
            slide.image = req.image;
        }

        Slide.update(slide, { where: { id: slide.id } }).then(r => {
            return res.json(r)
        })

    }

    createSlide(req, res) {
        var slide = Object.assign(req.body.slide)

        if (req.image != null) {
            slide.image = req.image;
        }

        Slide.findAll({ order: [['ordering', 'DESC']] }).then(rs => {
            if (rs.length) {
                slide.ordering = rs[0].ordering + 1
                Slide.create(slide).then(r => {
                    return res.json(r)
                })
            } else {
                slide.ordering = 1
                Slide.create(slide).then(r => {
                    return res.json(r)
                })
            }
        })


    }

    deleteSlide(req, res) {
        var id = req.params.id;
        Slide.destroy({
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

    changeSlidesOrder(req, res) {
        SlidesController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(sls) {
        await map(sls, async (s, i) => {
            await Slide.update({ ordering: i }, { where: { id: s.id } })
        })
        return true
    }


    changeStatus(req, res) {
        // return res.json(req.body.status)
        SlidesController.updateStatus(req.body.status, req.body.id).then(a => {
            return res.json({
                success: true,
                a
            })
        })
    }

    static async updateStatus(sts, id) {
        var a = await Slide.findOne({ where: { id: id } });
        a.status = sts;
        await a.save()
        return a
    }

}


module.exports = new SlidesController()