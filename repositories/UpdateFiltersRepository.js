const Region = require('../models/index').Region
const City = require('../models/index').City
const Theme = require('../models/index').Theme
const Attraction = require('../models/index').Attraction
const ValidateRepository = require('./ValidateRepository')
const {
    map
} = require('p-iteration');
const paths = require('../paths')
const slug = require('slug');
var Excel = require('exceljs');
const fs = require('fs');

class UpdateFiltersRepository {

    async createFiltersFromArray(array) {

        var jsons = []

        await map(array, async (fileName, i) => {
            var fileAlias = fileName.replace(/\.xlsx/i, '')
            jsons.push(await this.createRegionsFromExcelAssoc(fileName, fileAlias + '.json'))
        })

        await this.createFiltersFromJsonArray(jsons)

    }

    async createRegionsFromExcelAssoc(file, tofile) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(paths.root + '/import_data/filters/' + file)

        var data = []
        // console.log(file)

        await worksheet.eachSheet(async (worksheet2, sheetId) => {
            // console.log('sheet', worksheet2.getSheetValues())
            // var sheetData = worksheet2.getSheetValues();
            var i = -1;
            var ic = 0

            await worksheet2.eachRow(async (row, rowNumber) => {

                // console.log(row.cellCount, rowNumber)

                var region;


                if (row.cellCount == 1 && row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {

                    region = row.values[1].split(',')
                    let rObj = {}
                    rObj.name = region[0].trim();
                    rObj.alias = slug(region[0], { lower: true })
                    rObj.lat = region[1].trim();
                    rObj.lng = region[2].trim();
                    data.push({ region: rObj, cities: [], attractions: [] })
                    i++;
                    // console.log('create region', row.values[1])
                    ic = 0
                }



                if (row.cellCount == 2 && row.values[2] && row.values[2] != '' && row.values[2] != 'NULL' && typeof row.values[2] == 'string') {
                    // console.log(typeof row.values[2], row.values[2])
                    var city;
                    city = row.values[2].split(',')
                    let cObj = {}
                    cObj.name = city[0];
                    cObj.alias = slug(city[0], { lower: true })
                    cObj.lat = city[1];
                    cObj.lng = city[2];
                    cObj.attractions = []
                    data[i].cities.push(cObj)
                    // console.log('create city for ' + row.values[2], row.values[2])
                    var oldIc = Object.assign(ic);
                    ic++

                }


                if (row.cellCount >= 3) {
                    // console.log(typeof row.values[2], row.values[2])
                    var cellsCount = row.cellCount;
                    // console.log(row.values[2])
                    if (row.values[2] && row.values[2] != '' && row.values[2] != 'NULL' && typeof row.values[2] == 'string') {
                        city = row.values[2].split(',')
                        let cObj = {}
                        cObj.name = city[0];
                        cObj.alias = slug(city[0], { lower: true })
                        cObj.lat = city[1];
                        cObj.lng = city[2];
                        cObj.attractions = []
                        data[i].cities.push(cObj)
                        var oldIc = Object.assign(ic);
                        ic++


                        for (var j = 3; j <= cellsCount; j++) {
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                // console.log(typeof row.values[j], row.values[j])
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data[i].cities[oldIc].attractions.push(aObj)
                            }
                        }


                    } else {
                        for (var j = 3; j <= cellsCount; j++) {
                            // console.log(typeof row.values[j], row.values[j])
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data[i].attractions.push(aObj)
                            }

                        }
                    }


                }


            })

        })

        // console.log(data)

        fs.writeFileSync(paths.root + '/import_data/filters/jsons/' + tofile, JSON.stringify(data))
        return tofile;


    }

    async createFiltersFromJson(file) {
        var data = fs.readFileSync(paths.root + '/import_data/filters/jsons/' + file)
        data = JSON.parse(data)
        await map(data, async (r, i) => {
            var region = await Region.create(r.region)
            await this.createRegionCities(region, r.cities)
            await this.createRegionAttractions(region, r.attractions)
        })
    }

    async createFiltersFromJsonArray(array) {

        await map(array, async (fl, i) => {
            await this.createFiltersFromJson(fl)
        })
    }


    async createRegionCities(region, cits) {
        await map(cits, async (c, i) => {
            var bool = await ValidateRepository.isCityAliasExists(c.alias)
            var city = await this.createCity(c, bool)
            // var city = await City.create(c)
            await region.addCity(city)
            await this.createRegionsCityAttractions(region, city, c.attractions)

        })
    }

    async createRegionsCityAttractions(region, city, attractions) {
        await map(attractions, async (a, i) => {
            var bool = await ValidateRepository.isAttractionAliasExists(a.alias)
            var attr = await this.createAttraction(a, bool)
            // var attr = await Attraction.create(a)
            await region.addAttraction(attr)
            await city.addAttraction(attr)

        })
    }

    async createRegionAttractions(region, attrs) {
        await map(attrs, async (a, i) => {
            var bool = await ValidateRepository.isAttractionAliasExists(a.alias)
            var attr = await this.createAttraction(a, bool)
            // var attr = await Attraction.create(a)
            await region.addAttraction(attr)

        })
    }

    async createCity(c, bool) {
        if (bool) {
            const { attractions, alias, ...cc } = c
            var nc = await City.create(cc)
            var nAlias = c.alias + '-' + nc.id
            nc.alias = nAlias
            await nc.save()
        } else {
            const { attractions, ...cc } = c
            var nc = await City.create(cc)
        }
        return nc
    }

    async createAttraction(a, bool) {
        if (bool) {
            const { alias, ...aa } = a
            var na = await Attraction.create(aa)
            var nAlias = a.alias + '-' + na.id
            na.alias = nAlias
            await na.save()
        } else {
            var na = await Attraction.create(a)
        }
        return na
    }

    async createRegion(r, bool) {
        if (bool) {
            var nr = await Region.create(r)
            var nAlias = r.alias + '-' + nr.id
            nr.alias = nAlias
            await nr.save()
        } else {
            var nr = await Region.create(r)
        }
        return nr
    }

    async updateFiltersToRegion(regionId, file) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(paths.root + '/import_data/filters/' + file)

        var data = { regionId, related: [], freeAttractions: [] }
        // console.log(file)

        await worksheet.eachSheet(async (worksheet2, sheetId) => {

            var ic = -1

            await worksheet2.eachRow(async (row, rowNumber) => {



                if (row.cellCount == 1 && row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {

                    var city;
                    city = row.values[1].split(',')
                    let cObj = {}
                    cObj.name = city[0];
                    cObj.alias = slug(city[0], { lower: true })
                    cObj.lat = city[1];
                    cObj.lng = city[2];
                    cObj.attractions = []
                    data.related.push(cObj)
                    var oldIc = Object.assign(ic);
                    ic++
                }

                if (row.cellCount >= 2) {
                    // console.log(typeof row.values[2], row.values[2])
                    var cellsCount = row.cellCount;
                    // console.log(row.values[2])
                    if (row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {
                        city = row.values[1].split(',')
                        let cObj = {}
                        cObj.name = city[0];
                        cObj.alias = slug(city[0], { lower: true })
                        cObj.lat = city[1];
                        cObj.lng = city[2];
                        cObj.attractions = []
                        data.related.push(cObj)
                        var oldIc = Object.assign(ic);
                        ic++


                        for (var j = 2; j <= cellsCount; j++) {
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                // console.log(typeof row.values[j], row.values[j])
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data.related[ic].attractions.push(aObj)
                            }
                        }


                    } else {
                        for (var j = 2; j <= cellsCount; j++) {
                            // console.log(typeof row.values[j], row.values[j])
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data.freeAttractions.push(aObj)
                            }

                        }
                    }


                }

            })

        })


        return await this.updateFiltersDataFromObject(data)

    }

    async updateFiltersDataFromObject(data) {

        var region = await Region.findOne({ where: { id: data.regionId } })
        var cities = await region.getCities()
        var attractions = await region.getAttractions()

        await map(data.related, async (cc, i) => {

            var isCExists = false
            var withCExists = null

            await map(cities, async (c, j) => {

                if (c.name == cc.name) {
                    isCExists = true
                    withCExists = c
                }

            })

            if (!isCExists) {

                var boolCity = await ValidateRepository.isCityAliasExists(cc.alias)
                var nc = await this.createCity(cc, boolCity)
                await region.addCity(nc)

                await map(cc.attractions, async (aa, k) => {

                    var boolAttr = await ValidateRepository.isAttractionAliasExists(aa.alias)
                    var na = await this.createAttraction(aa, boolAttr)

                    await nc.addAttraction(na)
                    await region.addAttraction(na)
                })

            } else {

                var cAttrs = await withCExists.getAttractions()

                await map(cc.attractions, async (aa, k) => {
                    var isAExists = false
                    await map(cAttrs, async (a, l) => {
                        if (aa.name == a.name) {
                            isAExists = true
                        }
                    })

                    if (!isAExists) {
                        var boolAttr = await ValidateRepository.isAttractionAliasExists(aa.alias)
                        var na = await this.createAttraction(aa, boolAttr)
                        await withCExists.addAttraction(na)
                        await region.addAttraction(na)
                    }

                })

            }

        })


        var attractionsEmptyCity = await Attraction.findAll({ where: { cityId: null } })

        await map(data.freeAttractions, async (a, i) => {

            var isAttr = false

            await map(attractionsEmptyCity, async (aa, j) => {

                if (aa.alias == a.alias) {
                    isAttr = true
                }

            })


            if (!isAttr) {
                var boolAttr = await ValidateRepository.isAttractionAliasExists(a.alias)
                var na = await this.createAttraction(a, boolAttr)
                await region.addAttraction(na)
            }

        })



        return data
    }


    async createJsonFromIdsExcel(file) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(paths.root + '/commands/new_jsons/' + file)
        var array = []
        var fileAlias = file.replace(/\.xlsx/i, '')

        await worksheet.eachSheet(async (worksheet2, sheetId) => {


            await worksheet2.eachRow(async (row, rowNumber) => {

                // console.log(row.values)
                array.push({
                    id: row.values[1],
                    name: row.values[2]
                })

            })

        })


        fs.writeFileSync(paths.root + '/commands/new_jsons/' + fileAlias + '.json', JSON.stringify(array))

    }


    async createRegionsFromExcelAssocFindId(file, tofile, citiesIds, attractionsIds) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(paths.root + '/import_data/filters/' + file)

        var data = []
        // console.log(file)

        await worksheet.eachSheet(async (worksheet2, sheetId) => {
            // console.log('sheet', worksheet2.getSheetValues())
            // var sheetData = worksheet2.getSheetValues();
            var i = -1;
            var ic = 0

            await worksheet2.eachRow(async (row, rowNumber) => {

                // console.log(row.cellCount, rowNumber)

                var region;


                if (row.cellCount == 1 && row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {

                    region = row.values[1].split(',')
                    let rObj = {}
                    rObj.name = region[0].trim();
                    rObj.alias = slug(region[0], { lower: true })
                    rObj.lat = region[1].trim();
                    rObj.lng = region[2].trim();
                    data.push({ region: rObj, cities: [], attractions: [] })
                    i++;
                    // console.log('create region', row.values[1])
                    ic = 0
                }



                if (row.cellCount == 2 && row.values[2] && row.values[2] != '' && row.values[2] != 'NULL' && typeof row.values[2] == 'string') {
                    // console.log(typeof row.values[2], row.values[2])
                    var city;
                    city = row.values[2].split(',')
                    let cObj = {}
                    cObj.id = UpdateFiltersRepository.elementFindIdIfExists(city[0], citiesIds)
                    cObj.name = city[0];
                    cObj.alias = slug(city[0], { lower: true })
                    cObj.lat = city[1];
                    cObj.lng = city[2];
                    cObj.attractions = []
                    data[i].cities.push(cObj)
                    // console.log('create city for ' + row.values[2], row.values[2])
                    var oldIc = Object.assign(ic);
                    ic++

                }


                if (row.cellCount >= 3) {
                    // console.log(typeof row.values[2], row.values[2])
                    var cellsCount = row.cellCount;
                    // console.log(row.values[2])
                    if (row.values[2] && row.values[2] != '' && row.values[2] != 'NULL' && typeof row.values[2] == 'string') {
                        city = row.values[2].split(',')
                        let cObj = {}
                        cObj.id = UpdateFiltersRepository.elementFindIdIfExists(city[0], citiesIds)
                        cObj.name = city[0];
                        cObj.alias = slug(city[0], { lower: true })
                        cObj.lat = city[1];
                        cObj.lng = city[2];
                        cObj.attractions = []
                        data[i].cities.push(cObj)
                        var oldIc = Object.assign(ic);
                        ic++


                        for (var j = 3; j <= cellsCount; j++) {
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                // console.log(typeof row.values[j], row.values[j])
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.id = UpdateFiltersRepository.elementFindIdIfExists(attr[0], attractionsIds)
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data[i].cities[oldIc].attractions.push(aObj)
                            }
                        }


                    } else {
                        for (var j = 3; j <= cellsCount; j++) {
                            // console.log(typeof row.values[j], row.values[j])
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.id = UpdateFiltersRepository.elementFindIdIfExists(attr[0], attractionsIds)
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data[i].attractions.push(aObj)
                            }

                        }
                    }


                }


            })

        })

        // console.log(data)

        fs.writeFileSync(paths.root + '/import_data/filters/jsons/' + tofile, JSON.stringify(data))
        return tofile;


    }


    async updateFiltersToRegionCheckExists(regionId, file) {

        var workbook = new Excel.Workbook();
        var worksheet = await workbook.xlsx.readFile(paths.root + '/import_data/filters/updates/' + file)

        var data = { regionId, related: [], freeAttractions: [] }
        var fileAlias = file.replace(/\.xlsx/i, '')


        await worksheet.eachSheet(async (worksheet2, sheetId) => {

            var ic = -1

            await worksheet2.eachRow(async (row, rowNumber) => {


                if (row.cellCount == 1 && row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {


                    var city;
                    city = row.values[1].split(',')
                    // var checkCity = await this.checkIsCityExistsByNameGet(city[0])
                    let cObj = {}
                    cObj.name = city[0];
                    cObj.alias = slug(city[0], { lower: true })
                    cObj.lat = city[1];
                    cObj.lng = city[2];
                    cObj.attractions = []
                    data.related.push(cObj)
                    var oldIc = Object.assign(ic);
                    ic++
                }

                if (row.cellCount >= 2) {
                    // console.log(typeof row.values[2], row.values[2])
                    var cellsCount = row.cellCount;
                    // console.log(row.values[2])
                    if (row.values[1] && row.values[1] != '' && row.values[1] != 'NULL' && typeof row.values[1] == 'string') {
                        city = row.values[1].split(',')
                        let cObj = {}
                        cObj.name = city[0];
                        cObj.alias = slug(city[0], { lower: true })
                        cObj.lat = city[1];
                        cObj.lng = city[2];
                        cObj.attractions = []
                        data.related.push(cObj)
                        var oldIc = Object.assign(ic);
                        ic++


                        for (var j = 2; j <= cellsCount; j++) {
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                // console.log(typeof row.values[j], row.values[j])
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data.related[ic].attractions.push(aObj)
                            }
                        }


                    } else {
                        for (var j = 2; j <= cellsCount; j++) {
                            // console.log(typeof row.values[j], row.values[j])
                            if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL' && typeof row.values[j] == 'string') {
                                var attr = row.values[j].split(',')
                                let aObj = {}
                                aObj.name = attr[0];
                                aObj.alias = slug(attr[0], { lower: true })
                                aObj.lat = attr[1];
                                aObj.lng = attr[2];
                                aObj.attractionType = attr[3]
                                data.freeAttractions.push(aObj)
                            }

                        }
                    }


                }

            })

        })

        fs.writeFileSync(paths.root + '/import_data/filters/updates/jsons/' + fileAlias + '.json', JSON.stringify(data))
        console.log(data)
        return await this.updateFiltersDataFromObject(data)

    }


    async checkIsCityExistsByNameGet(name) {
        return await City.findOne({
            where: {
                name
            }
        })
    }



    static elementFindIdIfExists(name, list) {
        var id = null
        list.map((el, i) => {
            if (name == el.name) {
                id = el.id
            }
        })
        return id
    }


    async createFiltersFromArrayFindOld(array, citiesId, attractionsIds) {

        var jsons = []

        await map(array, async (fileName, i) => {
            var fileAlias = fileName.replace(/\.xlsx/i, '')
            jsons.push(await this.createRegionsFromExcelAssocFindId(fileName, fileAlias + '.json', citiesId, attractionsIds))
        })

        // await this.createFiltersFromJsonArray(jsons)

    }


}


module.exports = new UpdateFiltersRepository()