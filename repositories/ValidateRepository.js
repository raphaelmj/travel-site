const Article = require("../models/index").Article
const Category = require("../models/index").Category
const Event = require("../models/index").Event
const City = require("../models/index").City
const Region = require("../models/index").Region
const Catalog = require("../models/index").Catalog
const Attraction = require("../models/index").Attraction
var slug = require('slug')
const {
    map
} = require('p-iteration');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class ValidateRepository {


    checkIsAliasFree(req, res) {
        var data = req.body;
        var alias = slug(data.title, {
            lower: true
        })
        ValidateRepository.checkAliasDelegate(alias, data.type).then(b => {
            return res.json(b)
        })
    }

    checkIsAliasFreeExcept(req, res) {
        var data = req.body;
        var alias = slug(data.title, {
            lower: true
        })
        ValidateRepository.checkAliasDelegateExcept(alias, data.type, data.id).then(b => {
            return res.json(b)
        })
    }


    async checkIsAliasFreeDelagator(alias, type) {
        return await ValidateRepository.checkAliasDelegate(alias, type)
    }

    async checkIsArticleTitleChange(nTitle, artId) {
        var art = await Article.findOne({
            where: {
                id: artId
            }
        })

        return nTitle != art.title
    }

    async checkIsAliasFreeStatic(title, type) {
        var alias = slug(title, {
            lower: true
        })
        return await ValidateRepository.checkAliasDelegate(alias, type);
    }

    async checkIsAliasFreeExceptStatic(title, type, id) {
        var alias = slug(title, {
            lower: true
        })
        return await ValidateRepository.checkAliasDelegateExcept(alias, type, id);
    }

    static async checkAliasDelegate(alias, type) {
        var bool = true;
        switch (type) {
            case 'article':
                var bool = await ValidateRepository.checkArticleAlias(alias)
                break;

            case 'category':
                var bool = true;
                break;

            case 'event':
                var bool = await ValidateRepository.checkEventAlias(alias)
                break;

            case 'region':
                var bool = await ValidateRepository.isRegionAliasExistsStatic(alias)
                break;

            case 'city':
                var bool = await ValidateRepository.isCityAliasExistsStatic(alias)
                break;

            case 'attraction':
                var bool = await ValidateRepository.isAttractionAliasExistsStatic(alias)
                break;

            case 'catalog':
                var bool = await ValidateRepository.isCatalogAliasExists(alias)
                break;

        }
        return bool;
    }

    static async checkArticleAlias(alias) {
        var cnt = await Article.count({
            where: {
                alias: alias
            }
        })
        return cnt > 0;
    }


    static async checkAliasDelegateExcept(alias, type, id) {
        var bool = true;
        switch (type) {
            case 'article':
                var art = await Article.findOne({ where: { id } })
                var bool = await ValidateRepository.checkArticleAliasEx(alias, art.alias, id)
                break;

            case 'category':
                var cat = await Category.findOne({ where: { id } })
                var bool = await ValidateRepository.checkCategoryAliasEx(alias, cat.alias, id)
                break;


            case 'event':
                var bool = await ValidateRepository.checkEventAliasEx(alias, id)
                break;


            case 'region':
                var bool = await ValidateRepository.isRegionAliasExistsExceptStatic(alias, id)
                break;

            case 'city':
                var bool = await ValidateRepository.isCityAliasExistsExceptStatic(alias, id)
                break;

            case 'attraction':
                var bool = await ValidateRepository.isAttractionAliasExistsExceptStatic(alias, id)
                break;

            case 'catalog':
                var bool = await ValidateRepository.isCatalogAliasExistsExceptStatic(alias, id)
                break;


        }
        return bool;
    }


    static async checkArticleAliasEx(alias, old, id) {
        var cs = await Article.findAll({
            where: {
                alias: alias
            }
        })

        var fcs = cs.filter(a => a.id != id)

        return fcs.length > 0;
    }


    static async checkCategoryAliasEx(alias, old, id) {
        var cs = await Category.findAll({
            where: {
                alias: alias
            }
        })

        var fcs = cs.filter(a => a.id != id)

        return fcs.length > 0;
    }


    static async checkEventAliasEx(alias, id) {
        var evs = await Event.findAll({
            where: {
                alias: alias
            }
        })

        var fevs = evs.filter(a => a.id != id)

        return fevs.length > 0;
    }


    static async checkEventAlias(alias) {
        var cnt = await Event.count({
            where: {
                alias: alias
            }
        })
        return cnt > 0;
    }


    async isCityAliasExists(alias) {
        var cnt = await City.count({ where: { alias } })
        return cnt > 0;
    }

    async isRegionAliasExists(alias) {
        var cnt = await Region.count({ where: { alias } })
        return cnt > 0;
    }

    async isAttractionAliasExists(alias) {
        var cnt = await Attraction.count({ where: { alias } })
        return cnt > 0;
    }

    static async isCatalogAliasExists(alias) {
        var cnt = await Catalog.count({ where: { alias } })
        return cnt > 0;

    }


    async isCityAliasExistsExcept(alias, id) {
        var cnt = await City.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }

    async isRegionAliasExistsExcept(alias, id) {
        var cnt = await Region.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }

    async isAttractionAliasExistsExcept(alias, id) {
        var cnt = await Attraction.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }



    async isCatalogAliasExistsExcept(alias, id) {
        var cnt = await Catalog.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }




    static async isCityAliasExistsStatic(alias) {
        var cnt = await City.count({ where: { alias } })
        return cnt > 0;
    }

    static async isRegionAliasExistsStatic(alias) {
        var cnt = await Region.count({ where: { alias } })
        return cnt > 0;
    }

    static async isAttractionAliasExistsStatic(alias) {
        var cnt = await Attraction.count({ where: { alias } })
        return cnt > 0;
    }




    static async isCityAliasExistsExceptStatic(alias, id) {
        var cnt = await City.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }

    static async isRegionAliasExistsExceptStatic(alias, id) {
        var cnt = await Region.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }

    static async isAttractionAliasExistsExceptStatic(alias, id) {
        var cnt = await Attraction.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }


    static async isCatalogAliasExistsExceptStatic(alias, id) {
        var cnt = await Catalog.count({
            where: {
                alias,
                id: {
                    [Op.ne]: id
                }
            }
        })
        return cnt > 0;
    }


    async checkIsNumberEventFree(value, isNew, id) {

        var freeBool = true



        if (isNew) {

            var evs = await Event.count({ where: { number: value } })
            if (evs > 0) {
                freeBool = false
            } else {
                freeBool = true
            }

        } else {

            var evs = await Event.findAll({ where: { number: value } })

            var fevs = evs.filter(a => a.id != id)

            if (fevs.length > 0) {
                freeBool = false
            } else {
                freeBool = true
            }
        }

        return freeBool

    }

}

module.exports = new ValidateRepository()