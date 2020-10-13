const program = require('commander');
const faker = require('faker/locale/pl');
const fs = require('fs');
var moment = require('moment');
const sizeOf = require('image-size');
const paths = require('../paths')
const slug = require('slug')
const {
    map
} = require('p-iteration');
var Excel = require('exceljs');
const sequelize = require('../config/sequelize')
const User = require('../models/index').User
const Category = require('../models/index').Category
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Theme = require('../models/index').Theme
const Event = require('../models/index').Event
const Attraction = require('../models/index').Attraction
const Link = require('../models/index').Link
const Menu = require('../models/index').Menu
const Day = require('../models/index').Day
const Age = require('../models/index').Age
const Article = require('../models/index').Article
const Slide = require('../models/index').Slide
const Gallery = require('../models/index').Gallery
const Partner = require('../models/index').Partner
const HomePage = require('../models/index').HomePage
const MenuRepository = require('./MenuRepository')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const html2pug = require('html2pug')
const ParseHelper = require('../helpers/parse-helper')
const PathHelper = require('../helpers/paths-helper');
const FileSystemHelper = require('../helpers/file-system-helper')
const ValidateRepository = require("./ValidateRepository")

class ImportRepository {


    async importEvents(importFolder, catalogId) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(importFolder + '/events.xlsx')


        var data = []

        var checkIsNrEventExists = async (nr) => {
            var c = await Event.count({ where: { number: nr } })
            return c > 0
        }

        await worksheet.eachSheet(async (worksheet2, sheetId) => {


            await worksheet2.eachRow(async (row, rowNumber) => {

                if (rowNumber != 1) {

                    var isAdded = await checkIsNrEventExists(row.values[1])
                    if (!isAdded) {
                        var event = await this.createEvent(row.values, importFolder)
                        var imgPath = await this.getImagePutImage(row.values[2], event, importFolder)
                        await event.update({ image: imgPath }, { where: { id: event.id } })

                        //import days
                        if (row.cellCount > 17) {
                            if (row.values[18] && row.values[18] != 'NULL' && row.values[18] != '') {
                                var days = String(row.values[18]).split(';')
                                await this.associationsDaysCreate(days, event)
                            }
                        }


                        //import regions
                        if (row.cellCount > 18) {
                            if (row.values[19] && row.values[19] != 'NULL' && row.values[19] != '') {
                                var rids = String(row.values[19]).split(';')
                                await this.associationsRegionsCreate(rids, event)
                            }
                        }

                        //import cities
                        if (row.cellCount > 19 && row.values[20] != 'NULL' && row.values[20] != '') {

                            if (row.values[20]) {
                                var cids = String(row.values[20]).split(';')
                                await this.associationsCitiesCreate(cids, event)
                            }
                        }

                        //import attractions
                        if (row.cellCount > 20 && row.values[21] != 'NULL' && row.values[21] != '') {

                            if (row.values[21]) {
                                var aids = String(row.values[21]).split(';')
                                await this.associationsAttractionsCreate(aids, event)
                            }
                        }

                        //import theme
                        if (row.cellCount > 22 && row.values[22] != 'NULL' && row.values[22] != '') {

                            if (row.values[22]) {
                                var aids = String(row.values[22]).split(',')
                                await this.associationsAgesCreate(aids, event)
                            }
                        }


                        //import age
                        if (row.cellCount > 23 && row.values[23] != 'NULL' && row.values[23] != '') {

                            if (row.values[23]) {
                                var aids = String(row.values[23]).split(';')
                                await this.associationsAgesCreate(aids, event)
                            }
                        }
                        var c = await Catalog.findOne({ where: { id: catalogId } })
                        // console.log(c, event)
                        await c.addEvent(event)

                        await ElasticSearchRepository.indexNewEvent('wirtur', event.id)
                    }

                }





            })



        })


    }


    async getImagePutImage(imageName, event, importFolder) {
        var img = fs.readFileSync(importFolder + '/images/' + imageName)
        if (!fs.existsSync(paths.root + '/static/images/events/event' + event.id)) {
            fs.mkdirSync(paths.root + '/static/images/events/event' + event.id)
        }
        var filePath = '/images/events/event' + event.id + '/' + moment().format('MMMM-YYYY-h-mm-ss') + imageName
        fs.writeFileSync(paths.root + '/static' + filePath, img)
        return filePath
    }


    async createEvent(values, importFolder) {
        // console.log(values[0])
        // console.log(values[3])
        // console.log(values[5])
        // console.log(values[11])
        values = this.richTextConvertToString(values)
        // console.log(values[11])
        var pc = await this.getPriceConfig(values[11], importFolder)

        var alias = slug(values[3], { lower: true })
        var isAliasExists = await ValidateRepository.checkIsAliasFreeDelagator(alias, 'event')
        // values[1] += 'ccc';
        var eventData = this.prepareEventData(values, alias, isAliasExists, pc)

        // console.log(isAliasExists)
        // var event = await Event.create(eventData)
        if (isAliasExists) {
            var event = await Event.create(eventData)
            alias += '-' + event.id
            await Event.update({ alias }, { where: { id: event.id } })
        } else {
            var event = await Event.create(eventData)
        }

        return event;
    }


    richTextConvertToString(values) {
        Array.apply('NULL', values)
        var clearValues = []
        values.map((v, i) => {
            if (typeof v == 'object') {
                if (v.richText) {
                    var nv = ''
                    v.richText.forEach(rt => {
                        nv += rt.text
                    })
                    values[i] = nv
                    clearValues.push(nv)
                }

            } else {
                clearValues.push(v)
            }
        })
        return values
    }



    async associationsRegionsCreate(ids, event) {

        await map(ids, async (id, i) => {
            var idN = parseInt(id.trim())
            var r = await Region.findOne({ where: { id: idN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            await event.addRegion(r)
        })

    }

    async associationsCitiesCreate(ids, event) {

        await map(ids, async (id, i) => {
            var idN = parseInt(id.trim())
            var c = await City.findOne({ where: { id: idN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            await event.addCity(c)
        })

    }

    async associationsAttractionsCreate(ids, event) {

        await map(ids, async (id, i) => {
            var idN = parseInt(id.trim())
            var a = await Attraction.findOne({ where: { id: idN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            await ev.addAttraction(a)
        })

    }

    async associationsThemesCreate(ids, event) {

        await map(ids, async (id, i) => {
            var idN = parseInt(id.trim())
            var t = await Theme.findOne({ where: { id: idN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            await ev.addTheme(t)
        })

    }

    async associationsAgesCreate(ids, event) {

        await map(ids, async (id, i) => {
            var idN = parseInt(id.trim())
            var t = await Age.findOne({ where: { id: idN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            await ev.addAge(t)
        })

    }


    async associationsDaysCreate(days, event) {
        await map(days, async (dnr, i) => {
            var dN = parseInt(dnr.trim())

            var d = await Day.findOne({ where: { daysNumber: dN } })
            var ev = await Event.findOne({ where: { id: event.id } })
            if (d) {
                await ev.addDay(d)
            } else {
                var nd = await Day.create({ daysNumber: dnr })
                await ev.addDay(nd)
            }
        })
    }


    prepareEventData(values, alias, isAliasExists, pc) {

        var eventData = {
            number: values[1],
            name: values[3],
            alias: (isAliasExists) ? null : alias,
            smallDesc: values[4],
            longDesc: values[5],
            microGallery: [],
            attachments: [],
            priceNetto: (values[8] != 'NULL' && values[8]) ? values[8] : null,
            priceBrutto: (values[9] != 'NULL' && values[9]) ? values[9] : null,
            tax: (values[10] != 'NULL' && values[10]) ? values[10] : null,
            priceConfig: pc,
            status: values[12],
            eventType: values[13],
            eventSezonType: values[14],
            customersLimit: (values[15] != 'NULL' && values[15]) ? values[15] : null,
            startAt: (values[16] != 'NULL' && values[16]) ? values[16] : null,
            endAt: (values[16] != 'NULL' && values[16]) ? values[16] : null,

        }

        return eventData;
    }


    // async getPriceConfig(filename, importFolder) {

    //     var data = null;

    //     if (filename) {
    //         var workbook = new Excel.Workbook();
    //         var worksheet = await workbook.xlsx.readFile(importFolder + '/prices/' + filename)
    //         data = []
    //         await worksheet.eachSheet(async (worksheet2, sheetId) => {


    //             await worksheet2.eachRow(async (row, rowNumber) => {

    //                 // console.log(row.values)
    //                 if (rowNumber != 1) {
    //                     data.push({
    //                         from: row.values[1],
    //                         to: row.values[2],
    //                         price: row.values[3],
    //                         days: row.values[4]
    //                     })
    //                 }

    //             })

    //         })
    //     }

    //     return data;

    // }


    async getPriceConfig(filename, importFolder) {

        var data = null;

        if (filename) {
            var workbook = new Excel.Workbook();
            var worksheet = await workbook.xlsx.readFile(importFolder + '/prices/' + filename)
            // var worksheet = await workbook.xlsx.readFile(paths.root + '/' + importFolder + '/' + filename)
            data = []
            var i = -1
            await worksheet.eachSheet(async (worksheet2, sheetId) => {

                await worksheet2.eachRow(async (row, rowNumber) => {

                    // console.log(row.values)
                    if (rowNumber != 1) {
                        // data.push({
                        //     groupName:'',
                        //     groupDesc:'',
                        //     prices:
                        // })

                        if (row.values[1]) {
                            // console.log('data')
                            i++
                            data[i] = {
                                groupName: (row.values[1]) ? row.values[1] : '',
                                groupDesc: (row.values[2]) ? row.values[2] : '',
                                prices: []
                            }
                            data[i].prices.push({
                                from: row.values[3],
                                to: row.values[4],
                                price: row.values[5],
                                days: row.values[6]
                            })
                        } else {
                            data[i].prices.push({
                                from: row.values[3],
                                to: row.values[4],
                                price: row.values[5],
                                days: row.values[6]
                            })
                        }

                        // console.log(row.cellCount)
                        // console.log(row.values)
                    }

                })

            })
        }

        return data;

    }

}

module.exports = new ImportRepository()