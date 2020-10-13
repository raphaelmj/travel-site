const HomePage = require("../../models/index").HomePage
var slug = require('slug')
const {
    map
} = require('p-iteration');


class HomePageController {

    getHomePages(req, res) {
        HomePage.findAll({ order: [['ordering', 'ASC']] }).then(s => {
            return res.json(s)
        })
    }

    update(req, res) {

        var hp = Object.assign(req.body.hp)

        if (req.image != null) {
            hp.image = req.image;
        }

        HomePage.update(hp, { where: { id: hp.id } }).then(r => {
            return res.json(r)
        })


    }

    create(req, res) {

        var hp = Object.assign(req.body.hp)

        if (req.image != null) {
            hp.image = req.image;
        }

        HomePage.findAll({ order: [['ordering', 'DESC']] }).then(prs => {
            if (prs.length) {
                hp.ordering = prs[0].ordering + 1
                HomePage.create(hp).then(r => {
                    return res.json(r)
                })
            } else {
                hp.ordering = 1
                HomePage.create(hp).then(r => {
                    return res.json(r)
                })
            }
        })

    }

    delete(req, res) {
        var id = req.params.id;
        HomePage.destroy({
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
        HomePageController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await HomePage.update({ ordering: i }, { where: { id: s.id } })
        })
        return true
    }


    // changeStatus(req, res) {
    //     // return res.json(req.body.status)
    //     HomePageController.updateStatus(req.body.status, req.body.id).then(a => {
    //         return res.json({
    //             success: true,
    //             a
    //         })
    //     })
    // }

    // static async updateStatus(sts, id) {
    //     var a = await HomePage.findOne({ where: { id: id } });
    //     a.status = sts;
    //     await a.save()
    //     return a
    // }

}


module.exports = new HomePageController()