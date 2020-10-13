var Link = require('../models/index').Link;
var Article = require('../models/index').Article;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
var Catalog = require('../models/index').Catalog;
var Region = require('../models/index').Region;
var City = require('../models/index').City;
var Theme = require('../models/index').Theme;
var Age = require('../models/index').Age;
var Attraction = require('../models/index').Attraction
var Event = require('../models/index').Event;
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');
var moment = require('moment');

class UrlResourcesSearchRepository {

    static paramsToString(params) {
        var str = '';
        Object.keys(params).forEach((k, i) => {
            if (params[k] != undefined)
                str += params[k] + "/";
        })
        return str.slice(0, -1);
    }

    async parseUrlStart(path, countP, params, query) {

        var l = await Link.findOne({
            where: { path: path, status: 1 }
        })

        if (l) {
            return {
                searchFor: 'link',
                data: l
            };
        }

        var a = await this.parseFirstArgument(path, countP, params, query);

        if (a) {
            return a;
        }

        var b = await this.parseSecondArgument(path, countP, params, query);

        if (b) {
            return b;
        }

        return null;

    }



    async parseFirstArgument(path, countP, params, query) {

        if (countP == 1) {

            var catalog = await Catalog.findOne({
                where: { alias: params.a },
            });

            if (catalog) {
                return {
                    searchFor: 'catalog',
                    dataType: 'catalog',
                    data: {
                        catalog: catalog,
                    }
                }
            }

        }

        return null;

    }



    async parseSecondArgument(path, countP, params, query) {
        if (countP == 2) {


            var l = await Link.findOne({
                where: { path: params.a, status: 1 }
            })

            if (l) {

                switch (l.dataType) {


                    case 'articles':

                        if (l.categoryId) {

                            var art = await Article.findOne({
                                where: {
                                    alias: params.b,
                                    categoryId: l.categoryId
                                }
                            })


                            if (art) {
                                return {
                                    searchFor: 'article',
                                    dataType: 'article',
                                    data: art
                                }
                            }
                        }

                        break;


                    case 'galleries':


                        var gal = await Gallery.findOne({
                            where: {
                                alias: params.b
                            }
                        })


                        if (gal) {
                            return {
                                searchFor: 'gallery',
                                dataType: 'gallery',
                                data: gal
                            }
                        }

                        break;

                    case 'events':

                        if (l.catalogId) {

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })

                            var event = await ElasticSearchRepository.getEventByIndexId(ev.id)

                            if (ev) {
                                return {
                                    searchFor: 'event',
                                    dataType: 'event',
                                    data: { event: event._source, ev }
                                }
                            }

                        }

                        break;

                    case 'catalog':


                        if (l.catalogId) {

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })



                            if (ev) {
                                var event = await ElasticSearchRepository.getEventByIndexId(ev.id)
                                return {
                                    searchFor: 'event',
                                    dataType: 'event',
                                    data: { event: event._source, ev }
                                }
                            }

                        } else {
                            var current = await Catalog.findOne({ where: { current: true } })

                            if (current) {
                                var ev = await Event.findOne({
                                    where: {
                                        alias: params.b,
                                        catalogId: current.id
                                    }
                                })



                                if (ev) {
                                    var event = await ElasticSearchRepository.getEventByIndexId(ev.id)
                                    return {
                                        searchFor: 'event',
                                        dataType: 'event',
                                        data: { event: event._source, ev }
                                    }
                                }

                            }

                        }

                        break;



                }

            }

            var cat = await Category.findOne({
                where: {
                    alias: params.a
                }
            })

            if (cat) {

                var art = await Article.findOne({
                    where: {
                        alias: params.b,
                        categoryId: cat.id
                    }
                })


                if (art) {
                    return {
                        searchFor: 'article',
                        dataType: 'article',
                        data: art
                    }
                }

            }

            var catalog = await Catalog.findOne({
                where: {
                    alias: params.a
                }
            })

            if (catalog) {

                // console.log(catalog)

                var ev = await Event.findOne({
                    where: {
                        alias: params.b,
                        catalogId: catalog.id
                    }
                })

                if (ev) {

                    var event = await ElasticSearchRepository.getEventByIndexId(ev.id)


                    if (ev) {
                        return {
                            searchFor: 'event',
                            dataType: 'event',
                            data: { event: event._source, ev }
                        }
                    }

                }

            }

            return null;


        }

        return null;

    }





}

module.exports = new UrlResourcesSearchRepository();