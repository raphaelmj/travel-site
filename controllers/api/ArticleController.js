const Article = require('../../models/index').Article
const Category = require('../../models/index').Category
var slug = require('slug')
const cache = require('../../config/cache')
const ValidateRepository = require("../../repositories/ValidateRepository")
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const ElasticSearchRepository = require('../../repositories/ElasticSearchRepository')

class ArticleController {

    getLimitArticles(req, res) {

        ArticleController.queryArticlesList(req).then(d => {
            return res.json(d)
        })

    }


    static async queryArticlesList(req) {

        var whereData = {}

        if (req.body.categoryId) {
            whereData.categoryId = req.body.categoryId
        }

        if (req.body.phrase && req.body.phrase != '') {
            // console.log(req.body.phrase)
            whereData.title = {
                [Op.substring]: req.body.phrase
            }
        }

        var cData = await Article.findAndCountAll({
            where: whereData,
            offset: parseInt(req.body.start),
            limit: parseInt(req.body.limit),
            order: [
                [req.body.column, req.body.order]
            ],
            include: [
                { model: Category, as: 'category' }
            ],
            distinct: true
        })

        var qp = {
            limit: req.body.limit,
            start: req.body.start,
            column: req.body.column,
            order: req.body.order,
            phrase: req.body.phare,
            categoryId: req.body.categoryId

        }
        var toRes = {
            qp: qp,
            articles: cData.rows,
            total: cData.count
        }

        return toRes;

    }

    changeStatus(req, res) {
        // return res.json(req.body.status)
        ArticleController.updateStatus(req.body.status, req.body.id).then(a => {
            return res.json({
                success: true,
                a
            })
        })
    }

    static async updateStatus(sts, id) {
        var a = await Article.findOne({ where: { id: id } });
        a.status = sts;
        await a.save()
        return a
    }


    updateArticle(req, res, next) {
        var article = Object.assign(req.body.article)

        if (req.image != null) {
            article.image = req.image;
        }

        if (article.microGallery) {
            article.microGallery = article.microGallery
        }


        ValidateRepository.checkIsAliasFreeExceptStatic(article.title, 'article', article.id).then(bool => {

            ValidateRepository.checkIsArticleTitleChange(article.title, article.id).then(isChange => {

                if (isChange) {

                    var alias = ''

                    if (bool) {
                        alias = article.id + "-" + slug(article.title, {
                            lower: true
                        })
                    } else {
                        alias = slug(article.title, {
                            lower: true
                        })
                    }

                    article.alias = alias

                }

                Article.update(article, { where: { id: article.id } }).then(a => {

                    req.article = article;
                    // next()
                    return res.json(a)
                })

            })


        })


    }


    createArticle(req, res, next) {

        var article = Object.assign(req.body.article)

        if (req.image != null) {
            article.image = req.image;
        }

        if (article.microGallery) {
            article.microGallery = article.microGallery
        }

        article.alias = slug(article.title, {
            lower: true
        })


        ValidateRepository.checkIsAliasFreeStatic(article.title, 'article').then(bool => {

            if (bool) {

                var als = slug(article.title, {
                    lower: true
                })

                article.alias = null;

                Article.create(article).then(a => {
                    a.alias = a.id + "-" + als
                    a.save()
                    return res.json(a)
                })


            } else {

                Article.create(article).then(a => {
                    req.article = a;
                    next()
                    // return res.json(a)
                });

            }



        })

    }


    deleteArticle(req, res) {
        var id = req.params.id;
        Article.destroy({
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

}


module.exports = new ArticleController()