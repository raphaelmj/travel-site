var Link = require('../models/index').Link;
var Content = require('../models/index').Content;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
var Region = require('../models/index').Region;
var Doc = require('../models/index').Doc;
var Docdata = require('../models/index').Docdata;
var City = require('../models/index').City;
var Theme = require('../models/index').Theme;
var Event = require('../models/index').Event;
var Age = require('../models/index').Age;
var Attraction = require('../models/index').Attraction
var Catalog = require('../models/index').Catalog;
var Article = require('../models/index').Article;
var Slide = require('../models/index').Slide;
var HomePage = require('../models/index').HomePage;
var Partner = require('../models/index').Partner;
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const Op = Sequelize.Op;
const fs = require('fs');
const slug = require('slug');
const {
    map
} = require('p-iteration');
var moment = require('moment');
const TokenHelper = require('../helpers/token-helper')

class DocsRepository {

    async createDocFromFileData(fileData, filePath, type, noticeInfo) {

        var nInfo = {}
        Object.keys(noticeInfo).forEach((k, i) => {
            if (k != 'token') {
                nInfo[k] = noticeInfo[k]
            }
        })

        var d = await Doc.create({
            type,
            noticeInfo: JSON.stringify(nInfo),
            suffix: (fileData) ? fileData.suffix : null,
            mimeType: (fileData) ? fileData.mimetype : null
        })

        if (fileData) {
            var tokenData = await DocsRepository.prepareDocToken(d.id, fileData.tmpFileName, fileData.originalname);
        } else {
            var tokenData = await DocsRepository.prepareDocToken(d.id, moment().format('YYYYMMDDHHmmss'), moment().format('YYYYMMDDHHmmss'));
        }
        var tokenUrl = slug(tokenData, { lower: true })
        var number = d.id + 'D' + moment().format('YYYYMMDD')
        d.tokenData = tokenData;
        d.tokenUrl = tokenUrl;
        d.number = number
        await d.save()

        if (fileData) {
            var dd = await this.createDocData(fileData, filePath)
            await dd.setDoc(d)
            this.removeTmpFile(fileData.tmpFileName, filePath)
        }
        return d
    }


    static async prepareDocToken(id, tmpFileName, originalname) {
        return await TokenHelper.getHash(String(id) + tmpFileName + originalname)
    }


    removeTmpFile(tmpFileName, filePath) {
        return fs.unlinkSync(filePath + '/' + tmpFileName)
    }


    async createDocData(fileData, filePath) {
        var fileContent = fs.readFileSync(filePath + '/' + fileData.tmpFileName)
        const buffer = await Buffer.from(fileContent, 'base64');
        return await Docdata.create({ data: buffer })
    }


    async getDocFileData(tokenUrl) {
        var d = await Doc.findOne({ where: { tokenUrl } })
        if (!d)
            return null
        var dData = await d.getDocdatum()
        return { doc: d, docdata: dData }
    }


    async getDocsByQuery(query) {
        var where = []

        var limit = (query.limit) ? query.limit : 20
        limit = parseInt(limit)
        var page = (query.page) ? query.page : 1
        page = parseInt(page)
        var type = (query.type) ? query.type : 'all'

        var offset = 0;
        if (page && page != 1) {
            offset = (page - 1) * limit;
            offset--
        }

        if (type != 'all') {
            where.push({ type: type })
        }

        if (query.phrase) {
            where.push({
                [Op.or]: [
                    {
                        noticeInfo: {
                            [Op.substring]: query.phrase
                        }
                    },
                    {
                        number: {
                            [Op.substring]: query.phrase
                        }
                    }
                ]

            })
        }


        var docs = await Doc.findAndCountAll({
            where: {
                [Op.and]: where
            },
            order: [
                ['uploadAt', 'ASC']
            ],
            offset,
            limit,
            // distinct: true
        })


        return { dqp: query, docs: docs.rows, total: docs.count }

    }


    async inserQuestionToDocs(nInfo) {

        var d = await Doc.create({
            type: 'question',
            noticeInfo: JSON.stringify(nInfo),
            suffix: null,
            mimeType: null
        })


        var tokenData = await DocsRepository.prepareDocToken(d.id, moment().format('YYYYMMDDHHmmss'), moment().format('YYYYMMDDHHmmss'));
        var tokenUrl = slug(tokenData, { lower: true })
        var number = d.id + 'D' + moment().format('YYYYMMDD')
        d.tokenData = tokenData;
        d.tokenUrl = tokenUrl;
        d.number = number
        await d.save()
        return d

    }

}

module.exports = new DocsRepository()