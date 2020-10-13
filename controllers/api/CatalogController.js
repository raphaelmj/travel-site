const Catalog = require("../../models/index").Catalog
var slug = require('slug')
const {
    map
} = require('p-iteration');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const ValidateRepository = require('../../repositories/ValidateRepository')
const AngularIndexHelper = require('../../helpers/angular-index-helper')
const ElasticSearchUpdateSearchRepository = require('../../repositories/ElasticSearchUpdateRepository')
const CriteriaRepository = require('../../repositories/CriteriaRepository');
const cache = require('../../config/cache');

class CatalogController {

    getCatalog(req, res) {
        Catalog.findOne({
            where: parseInt(req.params.id)
        }).then(c => {
            return res.json(c)
        })

    }

    getCatalogs(req, res) {
        Catalog.findAll({
            order: [
                ['ordering', 'DESC']
            ]
        }).then(cs => {
            return res.json(cs)
        })
    }


    update(req, res) {

        var updateC = async () => {

            var catalog = Object.assign(req.body.catalog)
            // var alias = slug(catalog.name, { lower: true })

            var bool = await ValidateRepository.checkIsAliasFreeExceptStatic(catalog.name, 'catalog', catalog.id)

            if (req.image != null) {
                catalog.image = req.image;
            }

            if (bool) {
                catalog.alias = slug(catalog.name, { lower: true }) + '-' + catalog.id
            } else {
                catalog.alias = slug(catalog.name, { lower: true })
            }

            if (catalog.current) {
                await Catalog.update({ current: false }, {
                    where: {
                        id: {
                            [Op.ne]: catalog.id
                        }
                    }
                })
            }

            var c = await Catalog.update(catalog, { where: { id: catalog.id } })

            await ElasticSearchUpdateSearchRepository.updateEventsWhereCatalog(catalog.id)

            var a = new AngularIndexHelper()
            await a.makeFilesForAngularCatalogs()

            return c
        }


        updateC().then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })


    }

    create(req, res) {

        var createC = async () => {

            var catalog = Object.assign(req.body.catalog)

            var bool = await ValidateRepository.checkIsAliasFreeStatic(catalog.name, 'catalog')

            if (req.image != null) {
                catalog.image = req.image;
            }

            var els = await Catalog.findAll({ order: [['ordering', 'DESC']] })
            if (els.length) {
                catalog.ordering = els[0].ordering + 1

            } else {
                catalog.ordering = 1

            }




            var c
            if (bool) {
                c = await Catalog.create(catalog)
                if (catalog.current) {
                    await Catalog.update({ current: false }, {
                        where: {
                            id: {
                                [Op.ne]: c.id
                            }
                        }
                    })
                }
                c.alias = slug(catalog.name, { lower: true }) + '-' + c.id
                await c.save()
            } else {
                catalog.alias = slug(catalog.name, { lower: true })
                c = await Catalog.create(catalog)
                if (catalog.current) {
                    await Catalog.update({ current: false }, {
                        where: {
                            id: {
                                [Op.ne]: c.id
                            }
                        }
                    })
                }
            }

            await (new AngularIndexHelper()).makeFilesForAngularCatalogs()

            return c

        }

        createC().then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })

    }

    delete(req, res) {
        var id = req.params.id;
        Catalog.destroy({
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
        CatalogController.orderChange(req.body).then(bool => {
            return res.json(bool)
        })
    }


    static async orderChange(prms) {
        await map(prms, async (s, i) => {
            await Catalog.update({ ordering: prms.length - i }, { where: { id: s.id } })
        })
        return true
    }


}

module.exports = new CatalogController()