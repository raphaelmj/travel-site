var Link = require('../models/index').Link;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
var Region = require('../models/index').Region;
var City = require('../models/index').City;
var Theme = require('../models/index').Theme;
var Event = require('../models/index').Event;
var Age = require('../models/index').Age;
var Attraction = require('../models/index').Attraction
var Attachment = require('../models/index').Attachment
var Catalog = require('../models/index').Catalog;
var Article = require('../models/index').Article;
var Slide = require('../models/index').Slide;
var HomePage = require('../models/index').HomePage;
var Partner = require('../models/index').Partner;
var Institution = require('../models/index').Institution
var Recomendation = require('../models/index').Recomendation
var Promo = require('../models/index').Promo;
const WidgetRepository = require('./WidgetRepository')
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');
var moment = require('moment');

class ResourceToViewRepository {

    async selectMyResourceType(d, q) {

        var c = await this.getCurrentCatalog()


        switch (d.searchFor) {

            case 'link':


                var data = await this.withLinkResource(d.data, q);

                data.currentCatalog = c

                return data

                break;

            case 'gallery':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'galleries':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'events':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'event':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'articles':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'article':

                d.data.currentCatalog = c

                return d.data;

                break;

            case 'catalog':

                d.data.currentCatalog = c

                return d.data;

                break;


            case 'category':

                d.data.currentCatalog = c

                return d.data;

                break;


            case 'catalogs_presentation':

                d.data.currentCatalog = c

                return d.data;

                break;


            case 'institutions_list':

                d.data.currentCatalog = c

                return d.data

                break;

            case 'recomendations_files':

                d.data.currentCatalog = c

                return d.data

                break

            case 'sezon':

                d.data.currentCatalog = c

                return d.data

                break

        }
    }


    async getCurrentCatalog() {
        var c = await Catalog.findOne({ where: { current: true } })
        return c;
    }


    async withLinkResource(l, q) {

        switch (l.dataType) {

            case 'category':

                if (l.categoryId != null) {

                    var offset = 0;
                    if (q.page && q.page != 1) {
                        offset = (q.page - 1) * limit.eventsLimit;
                    }


                    var d = await Article.findAndCountAll({
                        where: {
                            categoryId: l.categoryId,
                            status: true
                        },
                        offset,
                        limit: limit.articlesLimit,

                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ],

                        // order: [
                        //     ['publishedAt', 'DESC']
                        // ],
                        distinct: true
                    })

                    return {
                        data: d,
                        category: await l.getCategory(),
                        offset,
                        limit: limit.articlesLimit
                    };

                } else {
                    return null;
                }

                break;

            case 'catalog':


                // var offset = 0;
                // if (q.page && q.page != 1) {
                //     offset = (q.page - 1) * limit.eventsLimit;
                // }


                // var d = await Event.findAndCountAll({
                //     where: {
                //         eventSezonType: {
                //             [Op.not]: ['winter', 'summer']
                //         },
                //         eventType: 'template',
                //         catalogId: l.catalogId
                //     },
                //     // order: Sequelize.literal('startAt DESC'),
                //     offset: offset,
                //     limit: limit.eventsLimit,
                //     include: [
                //         {
                //             model: Region,
                //             as: 'Regions'
                //         },
                //         {
                //             model: Age,
                //             as: 'Ages'
                //         }
                //     ],
                //     distinct: true
                // })

                var catalog = await l.getCatalog()

                if (!catalog) {
                    var catalog = await Catalog.findOne({ where: { current: true } })
                    if (!catalog) {
                        return null
                    }
                }

                return {
                    // events: d,
                    // offset: offset,
                    // limit: limit.eventsLimit,
                    catalog
                };

                break;

            case 'catalog_template':


                // var offset = 0;
                // if (q.page && q.page != 1) {
                //     offset = (q.page - 1) * limit.eventsLimit;
                // }


                // var d = await Event.findAndCountAll({
                //     where: {
                //         eventSezonType: {
                //             [Op.not]: ['winter', 'summer']
                //         },
                //         eventType: 'template',
                //         catalogId: l.catalogId
                //     },
                //     // order: Sequelize.literal('startAt DESC'),
                //     offset: offset,
                //     limit: limit.eventsLimit,
                //     include: [
                //         {
                //             model: Region,
                //             as: 'Regions'
                //         },
                //         {
                //             model: Age,
                //             as: 'Ages'
                //         }
                //     ],
                //     distinct: true
                // })



                return {
                    // events: d,
                    // offset: offset,
                    // limit: limit.eventsLimit,
                    catalog: await l.getCatalog()
                };

                break;

            case 'article':

                // if (l.content_id != null) {

                //     var cnt = await Content.find({
                //         id: l.content_id
                //     }).findAsync();

                //     var galleries = await Gallery.find({
                //         content_id: l.content_id
                //     }).order('published_at').findAsync();

                //     cnt[0].galleries = galleries;

                //     if (cnt[0].category_id != null) {
                //         cnt[0].category = await Category.getAsync(cnt[0].category_id);
                //     }

                //     return cnt[0];
                // } else {
                //     return null;
                // }

                return {}

                break;

            case 'articles':

                if (l.categoryId) {
                    var arts = await Article.findAll({
                        where: {
                            categoryId: l.categoryId,
                            status: true
                        },
                        order: [
                            ['ordering', 'asc']
                        ]
                    })

                    return { articles: arts, category: await l.getCategory() };

                }

                return null


                break;

            case 'galleries':


                var d;


                return d;

                break;

            case 'map':
                return {}
                break


            case 'events':

                if (l.catalogId) {

                    var all = false;
                    if (q.hasOwnProperty('all')) {
                        all = true;
                    }

                    var iEvents = await ElasticSearchRepository.searchCatalogIndexByType(l.eventsType, l.catalogId, all, 0, 100, 'wirtur')


                    // var where = {
                    //     catalogId: l.catalogId,
                    //     eventSezonType: l.eventsType,
                    //     status: {
                    //         [Op.not]: ['arch']
                    //     }
                    // }

                    // if (!q.hasOwnProperty('all')) {
                    //     where.startAt = { [Op.gt]: new Date() }
                    // }

                    // var ev = await Event.findAll({
                    //     where,
                    //     order: Sequelize.literal('startAt ASC'),
                    //     include: [
                    //         {
                    //             model: Region,
                    //             as: 'Regions'
                    //         },
                    //         {
                    //             model: Age,
                    //             as: 'Ages'
                    //         }
                    //     ]
                    // })



                    // if (ev) {
                    //     return { events: ev, catalog: await l.getCatalog() };
                    // }


                    return { events: iEvents, catalog: await l.getCatalog() };




                } else {

                    var catalog = await Catalog.findOne({ where: { current: true } })

                    if (catalog) {

                        var all = false;
                        if (q.hasOwnProperty('all')) {
                            all = true;
                        }

                        var iEvents = await ElasticSearchRepository.searchCatalogIndexByType(l.eventsType, catalog.id, all, 0, 100, 'wirtur')

                        return { events: iEvents, catalog };

                    } else {
                        return null;
                    }


                }
                break;

            case 'invoice':
                return {}
                break;

            case 'insurance':
                return {}
                break

            case 'attachments':

                var attachments = await Attachment.findAll({ where: { status: true } })

                return { attachments };
                break;

            case 'form_question':

                return {}
                break;

            case 'invoice':
                return {}
                break;

            case 'insurance':
                return {}
                break;

            case 'catalogs_presentation':

                var catalogs = await Catalog.findAll({
                    order: [
                        ['ordering', 'DESC']
                    ]
                })

                return { catalogs }
                break;

            case 'institutions_list':

                var institutions = await Institution.findAll({ where: { status: true } })

                return { institutions }

                break;


            case 'recomendations_files':

                var recomendations = await Recomendation.findAll(
                    {
                        where: { status: true },
                        order: [
                            ['ordering', 'DESC']
                        ]
                    })

                return { recomendations }

                break

            case 'distribution_page':

                var childsLinks = await l.getLinks()
                // console.log(childsLinks)

                return { childsLinks }

                break

            case 'sezon':
                var iEvents = await ElasticSearchRepository.getSezonCatalogEvents('wirtur')
                return { events: iEvents }

                break


            case 'content':

                return {}

                break

            case 'custom':

                return {}

                break

            case 'blank':
                return {};

                break;


        }
    }

    static makeSelfLink(alias, linkAlias) {
        return '/' + linkAlias + '/' + alias;
    }


    async homeDataGet() {
        var homeData = {};
        homeData.slides = await Slide.findAll({
            where: {
                status: true,
            },
            order: [
                ['ordering', 'ASC']
            ]
        })

        homeData.boxes = await HomePage.findAll({
            where: {},
            order: [
                ['ordering', 'ASC']
            ]
        })

        homeData.homeArticle = await Article.findOne({
            where: {
                onHome: 1
            },
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ]
        })

        homeData.promos = await Promo.findAll({
            where: {
                status: true
            },
            order: [
                ['ordering', 'ASC']
            ]
        })

        homeData.currentCatalog = await Catalog.findOne({
            where: {
                current: true
            }
        })


        homeData.partners = await Partner.findAll({
            order: [
                ['ordering', 'asc']
            ]
        })

        homeData.articles = await Article.findAll({
            order: [
                ['publishedAt', 'desc']
            ],
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ],
            offset: 0,
            limit: 3
        })

        homeData.widgetsGroup = await WidgetRepository.getWidgetsGroup()

        homeData.link = await Link.findOne({ where: { dataType: 'home' } })

        return homeData;
    }


}

module.exports = new ResourceToViewRepository();