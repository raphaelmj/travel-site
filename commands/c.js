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
const Institution = require('../models/index').Institution
const Attachment = require('../models/index').Attachment
const Recomendation = require('../models/index').Recomendation
const Widget = require('../models/index').Widget
const Promo = require('../models/index').Promo
const Promotion = require('../models/index').Promotion
const Password = require('../helpers/password')
const MenuRepository = require('../repositories/MenuRepository')
const ElasticSearchRepository = require('../repositories/ElasticSearchRepository')
const html2pug = require('html2pug')
const ParseHelper = require('../helpers/parse-helper')
const PathHelper = require('../helpers/paths-helper');
const FileSystemHelper = require('../helpers/file-system-helper')
const AngularIndexHelper = require('../helpers/angular-index-helper')
const ImportRepository = require('../repositories/ImportRepository')
const UpdateFiltersRepository = require('../repositories/UpdateFiltersRepository');



// var microGallery = [];

// var images = fs.readdirSync('../static/images/micro_gallery')
// images.forEach(img => {
//     var s = sizeOf('../static/images/micro_gallery/' + img);
//     microGallery.push({
//         image: '/images/micro_gallery/' + img,
//         width: s.width,
//         height: s.height,
//         sizeString: s.width + 'x' + s.height
//     })
// })

// console.log(microGallery)

// program
//     .command('sync-el')
//     .action(() => {
//         Widget.sync({ force: true })
//     })


program
    .command('sync-orm')
    .action(() => {
        sequelize.sync({
            force: true
        })
    })


program
    .command('create-users')
    .action(async () => {
        Password.getHash('Wtur21').then(pass => {
            User.create({
                email: 'wirtur@wirtur.pl',
                password: pass,
                status: 1
            }).then(r => {
                // console.log(r)
            })
        })
    })

program
    .command('create-widgets')
    .action(() => {

        var createWidgets = async () => {

            var widgets = fs.readFileSync(paths.root + '/commands/widgets.json')
            var wds = JSON.parse(widgets)

            await map(wds, async (w, i) => {

                // console.log(w)
                await Widget.create(w)

            })

        }


        createWidgets()

    })

async function createCategoriesFormJson(json) {

    var cats = JSON.parse(json)
    return await Category.bulkCreate(cats);

}

program
    .command('create-categories')
    .action(() => {

        var cats = fs.readFileSync(paths.root + '/commands/categories.json')

        createCategoriesFormJson(cats).then(r => {
            // console.log(r)
        })

    })

program
    .command('make-promo')
    .action(() => {

        var makeP = async () => {
            var promos = fs.readFileSync(paths.root + '/commands/promos.json')
            var prs = JSON.parse(promos)
            Promo.bulkCreate(prs)
        }

        makeP()

    })


async function createPartnersFormJson(json) {

    var ptns = JSON.parse(json)
    return await Partner.bulkCreate(ptns);

}

program
    .command('create-partners')
    .action(() => {

        var ptns = fs.readFileSync(paths.root + '/commands/partners.json')

        createPartnersFormJson(ptns).then(r => {
            // console.log(r)
        })

    })


async function createCatalogs() {
    var cats = fs.readFileSync(paths.root + '/commands/catalogs.json')
    cats = JSON.parse(cats)
    return await Catalog.bulkCreate(cats)
}

program
    .command('create-catalogs')
    .action(() => {

        createCatalogs().then(d => {

        })

    })


async function createArticles() {

    var cats = await Category.findAll();
    var lastK = cats.length - 1;

    await map(Array(80).fill(0), async (v, i) => {

        var t = faker.lorem.sentence(2, 3);

        var art = await Article.create({
            title: t,
            alias: slug(t, { lower: true }),
            image: '/images/default.jpg',
            smallDesc: faker.lorem.sentence(60, 100),
            longDesc: faker.lorem.sentence(300, 500),
            params: { galleryCols: faker.random.number({ min: 1, max: 3 }) }
        })

        cats[faker.random.number({ min: 0, max: lastK })].addArticle(art)

    })

    var countArts = await Article.count();
    // console.log(countArts)
    var id = faker.random.number({ min: 1, max: countArts });
    // console.log(id)
    await Article.update({ onHome: true }, { where: { id } });

}

async function makeHomeArticle() {
    var countArts = await Article.count();
    var id = faker.random.number({ min: 1, max: countArts });
    await Article.update({ onHome: true }, { where: { id } });
}

program
    .command('create-articles')
    .action(() => {

        createArticles().then((d) => {
            makeHomeArticle()
        })

    })


async function createFilters() {

    await map(Array(20).fill(0), async (v, i) => {

        var r = await Region.create({
            name: faker.address.country()
        })


        await map(Array(10).fill(0), async (v2, i2) => {

            var c = await City.create({
                name: faker.address.city()
            })


            r.addCity(c)

            await map(Array(6).fill(0), async (v3, i3) => {

                var a = await Attraction.create({
                    name: faker.commerce.productMaterial(),
                    lat: faker.address.latitude(),
                    lng: faker.address.longitude()
                })

                c.addAttraction(a)

            })

        })

    })

    var ages = fs.readFileSync(paths.root + '/commands/ages.json');
    var d = JSON.parse(ages)
    await Age.bulkCreate(d)

    await map(Array(30).fill(0), async (v, i) => {

        Theme.create({
            name: faker.commerce.color()
        })

    })

}

async function createFiltersMin() {

    var attrTypes = ['any', 'park', 'muzeum', 'monument', 'sacral', 'nature', 'aqua']

    await map(Array(20).fill(0), async (v, i) => {

        var rname = faker.address.country() + ' ' + i

        var r = await Region.create({
            name: rname,
            // alias: slug(rname, { lower: true }),
            lat: faker.address.latitude(),
            lng: faker.address.longitude()
        })


        await map(Array(4).fill(0), async (v2, i2) => {

            var cname = faker.address.city() + ' ' + i2;

            var c = await City.create({
                name: cname,
                // alias: slug(cname, { lower: true }),
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            })


            r.addCity(c)

            await map(Array(6).fill(0), async (v3, i3) => {

                var aname = faker.commerce.productMaterial() + ' ' + i3;

                var a = await Attraction.create({
                    name: aname,
                    // alias: slug(aname, { lower: true }),
                    lat: faker.address.latitude(),
                    lng: faker.address.longitude(),
                    attractionType: attrTypes[faker.random.number({ min: 0, max: attrTypes.length - 1 })]
                })

                c.addAttraction(a)
                r.addAttraction(a)

            })

        })

    })

    var ages = fs.readFileSync(paths.root + '/commands/ages.json');
    var d = JSON.parse(ages)
    await Age.bulkCreate(d)

    await map(Array(30).fill(0), async (v, i) => {

        var color = faker.commerce.color()

        Theme.create({
            name: color + i,
            // alias: slug(color, { lower: true }) + i,
        })

    })

    var days = [
        1, 2, 3, 5, 7, 14
    ]

    await map(days, async (dn, i) => {
        await Day.create({
            daysNumber: dn
        })
    })
}



function createBruttoFromNettoTax(price) {

    var percent = 21;
    var tax = Math.ceil((percent / 100) * parseFloat(price))

    return { pb: Math.ceil(parseFloat(price) + tax), tax: tax };

}


async function createEvents(microGallery) {


    var microGallery = [{
        image: '/images/micro_gallery/kolonie1.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie13.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie6.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie7.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    }]


    var eventsList = [];
    var configPrice = [
        {
            "from": 5,
            "to": 10,
            "price": 300.20,
            "days": 1
        },
        {
            "from": 11,
            "to": 15,
            "price": 240.20,
            "days": 1
        },
        {
            "from": 16,
            "to": 22,
            "price": 200.20,
            "days": 1
        },
        {
            "from": 23,
            "to": 35,
            "price": 170.20,
            "days": 1
        },
        {
            "from": 36,
            "to": 50,
            "price": 110.20,
            "days": 1
        },
        {
            "from": 5,
            "to": 10,
            "price": 300.20,
            "days": 2
        },
        {
            "from": 11,
            "to": 15,
            "price": 240.20,
            "days": 2
        },
        {
            "from": 16,
            "to": 22,
            "price": 200.20,
            "days": 2
        },
        {
            "from": 23,
            "to": 35,
            "price": 170.20,
            "days": 2
        },
        {
            "from": 36,
            "to": 50,
            "price": 110.20,
            "days": 2
        }
    ]
    // configPrice = JSON.stringify(configPrice);

    await map(Array(100).fill(0), async (v, i) => {

        var n = faker.lorem.sentence(3) + ` ${i}`;
        var isPrice = false;
        var pNetto = null;
        var pBrutto = null;
        var tax = null;
        var eventType = 'template'
        var st = null;
        var end = null;
        var daysTotal = null;
        var eventSezonType = 'any';
        var img = '/img/default-event-image.png';
        if (faker.random.boolean()) {
            img = '/images/default.jpg';
        }

        if (faker.random.boolean()) {

            isPrice = true;
            pNetto = faker.commerce.price()
            var taxBrutto = createBruttoFromNettoTax(pNetto)
            pBrutto = taxBrutto.pb;
            tax = taxBrutto.tax;
            eventType = 'organize'
            daysTotal = faker.random.number({ min: 1, max: 14 })
            st = (faker.random.boolean()) ? faker.date.future() : faker.date.past();
            end = moment(st).add(daysTotal, 'day')

            if (faker.random.boolean()) {
                eventSezonType = 'winter'
            } else {
                eventSezonType = 'summer'
            }

        } else {


            daysTotal = faker.random.number({ min: 1, max: 14 })
            eventType = 'template'
        }

        // configPrice = JSON.parse(JSON.stringify(configPrice));
        var nrEv = (faker.random.boolean()) ? faker.date.future() : faker.date.past();

        var ev = await Event.create({
            number: 'NR' + i + '' + moment(nrEv).format('DDMMYYYY'),
            name: n,
            alias: slug(n, { lower: true }),
            smallDesc: faker.lorem.sentence(80),
            longDesc: faker.lorem.sentence(100),
            priceNetto: pNetto,
            priceBrutto: pBrutto,
            tax: tax,
            priceConfig: configPrice,
            eventType: eventType,
            eventSezonType,
            microGallery: (true) ? JSON.stringify(microGallery) : JSON.stringify([]),
            startAt: st,
            endAt: end,
            daysTotal: daysTotal,
            status: (faker.random.boolean()) ? 'avl' : 'noavl',
            image: img
        })

        eventsList.push(ev);


        var ages = await Age.findAll({})

        await map(ages, async (ag, ia) => {

            if (faker.random.boolean()) {

                await ev.addAge(ag)

            }

        })



        var thms = await Theme.findAll({})

        await map(thms, async (tm, it) => {

            if (faker.random.boolean()) {

                await ev.addTheme(tm)

            }

        })


        var regs = await Region.findAll()

        await map(regs, async (r, j) => {


            if (faker.random.boolean()) {


                await ev.addRegion(r);


                var cs = await r.getCities()

                await map(cs, async (c, k) => {

                    if (faker.random.boolean()) {

                        await ev.addCity(c)

                        var attrs = await c.getAttractions()


                        await map(attrs, async (a, l) => {

                            if (faker.random.boolean()) {

                                await ev.addAttraction(a)

                            }

                        })

                    }

                })

            }

        })




    })


}


async function createEventsMin(howMany) {


    var microGallery = [{
        image: '/images/micro_gallery/kolonie1.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie13.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie6.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    },
    {
        image: '/images/micro_gallery/kolonie7.jpg',
        width: 1000,
        height: 1000,
        sizeString: '1000x1000'
    }]


    var eventsList = [];
    var configPrice = [
        {
            "from": 5,
            "to": 10,
            "price": 300.20,
            "days": 2
        },
        {
            "from": 11,
            "to": 15,
            "price": 240.20,
            "days": 2
        },
        {
            "from": 16,
            "to": 22,
            "price": 200.20,
            "days": 2
        },
        {
            "from": 23,
            "to": 35,
            "price": 170.20,
            "days": 2
        },
        {
            "from": 36,
            "to": 50,
            "price": 110.20,
            "days": 2
        },
        {
            "from": 5,
            "to": 10,
            "price": 300.20,
            "days": 3
        },
        {
            "from": 11,
            "to": 15,
            "price": 240.20,
            "days": 3
        },
        {
            "from": 16,
            "to": 22,
            "price": 200.20,
            "days": 3
        },
        {
            "from": 23,
            "to": 35,
            "price": 170.20,
            "days": 3
        },
        {
            "from": 36,
            "to": 50,
            "price": 110.20,
            "days": 3
        }
    ]
    // configPrice = JSON.stringify(configPrice);

    await map(Array(howMany).fill(0), async (v, i) => {

        var n = faker.lorem.sentence(3) + ` ${i}`;
        var isPrice = false;
        var pNetto = null;
        var pBrutto = null;
        var tax = null;
        var eventType = 'template'
        var st = null;
        var end = null;
        var daysTotal = null;
        var eventSezonType = 'any';
        var img = '/img/default-event-image.png';
        if (faker.random.boolean()) {
            img = '/images/default.jpg';
        }

        if (faker.random.boolean()) {

            isPrice = true;
            pNetto = faker.commerce.price()
            var taxBrutto = createBruttoFromNettoTax(pNetto)
            pBrutto = taxBrutto.pb;
            tax = taxBrutto.tax;
            eventType = 'organize'
            st = (faker.random.boolean()) ? faker.date.future() : faker.date.past();
            end = moment(st).add(daysTotal, 'day')

            if (faker.random.boolean()) {
                eventSezonType = 'winter'
            } else {
                eventSezonType = 'summer'
            }

        } else {


            daysTotal = faker.random.number({ min: 1, max: 14 })
            eventType = 'template'
        }

        // configPrice = JSON.parse(JSON.stringify(configPrice));
        var nrEv = (faker.random.boolean()) ? faker.date.future() : faker.date.past();

        var ev = await Event.create({
            number: 'NR' + i + '' + moment(nrEv).format('DDMMYYYY'),
            name: n,
            alias: slug(n, { lower: true }),
            smallDesc: faker.lorem.sentence(80),
            longDesc: faker.lorem.sentence(100),
            priceNetto: pNetto,
            priceBrutto: pBrutto,
            tax: tax,
            priceConfig: configPrice,
            eventType: eventType,
            eventSezonType,
            microGallery: (true) ? JSON.stringify(microGallery) : JSON.stringify([]),
            startAt: st,
            endAt: end,
            daysTotal: daysTotal,
            status: (faker.random.boolean()) ? 'avl' : 'noavl',
            image: img,
        })

        eventsList.push(ev);


        var ages = await Age.findAll({})

        await map(ages, async (ag, ia) => {

            if (faker.random.boolean()) {

                await ev.addAge(ag)

            }

        })



        var thms = await Theme.findAll({})
        var countTh = 0;

        await map(thms, async (tm, it) => {

            if (faker.random.boolean()) {

                if (countTh < 3) {

                    await ev.addTheme(tm)

                }

                await countTh++;

            }

        })


        var regs = await Region.findAll()
        var countRegs = 0;

        await map(regs, async (r, j) => {


            if (faker.random.boolean()) {


                if (countRegs < 2) {
                    await ev.addRegion(r);

                    var cs = await r.getCities()
                    var countCit = 0;

                    await map(cs, async (c, k) => {

                        if (faker.random.boolean()) {

                            if (countCit < 3) {

                                await ev.addCity(c)

                                var attrs = await c.getAttractions()

                                var attrsCount = 0;

                                await map(attrs, async (a, l) => {

                                    if (faker.random.boolean()) {

                                        if (attrsCount < 5) {

                                            await ev.addAttraction(a)

                                        }

                                        await attrsCount++

                                    }

                                })

                            }

                        }

                    })

                    await countRegs++;

                }

                await countRegs++

            }



        })




    })


}


async function createDays() {
    var days = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ]

    await map(days, async (dn, i) => {
        await Day.create({
            daysNumber: dn
        })
    })
}


async function addEventsToCatalog() {

    var catalogs = await Catalog.findAll({ where: { searchList: true } });
    var eventsList = await Event.findAll({ where: { catalogId: null } })

    await map(eventsList, async (ev, i) => {

        var cNr = faker.random.number({ min: 0, max: catalogs.length - 1 })
        await catalogs[cNr].addEvent(ev)

    })

}

async function addEventsDays() {

    var events = await Event.findAll({ where: { catalogId: null } })

    var days = await Day.findAll();
    var lastId = days.length - 1


    await map(events, async (ev, i) => {

        var fD1 = faker.random.number({ min: 1, max: lastId })
        var fD2 = faker.random.number({ min: 1, max: lastId })
        var d1 = await Day.findOne({ where: { id: fD1 } })
        var d2 = await Day.findOne({ where: { id: fD2 } })

        if (ev.eventType == 'template') {

            await ev.addDay(d1)
            await ev.addDay(d2)

        } else {

            await ev.addDay(d1)

        }

    })

}


async function createFiltersFromJson(file) {
    var data = fs.readFileSync(paths.root + '/commands/' + file)
    data = JSON.parse(data)
    await map(data, async (r, i) => {
        var region = await Region.create(r.region)
        await createRegionCities(region, r.cities)
        await createRegionAttractions(region, r.attractions)
    })
}

async function createFiltersFromJsonArray(array) {

    await map(array, async (fl, i) => {
        createFiltersFromJson(fl)
    })
}


async function createRegionCities(region, cits) {
    await map(cits, async (c, i) => {

        var city = await City.create(c)
        await region.addCity(city)
        await createRegionsCityAttractions(region, city, c.attractions)

    })
}

async function createRegionsCityAttractions(region, city, attractions) {
    await map(attractions, async (a, i) => {

        var attr = await Attraction.create(a)
        await region.addAttraction(attr)
        await city.addAttraction(attr)


    })
}

async function createRegionAttractions(region, attrs) {
    await map(attrs, async (a, i) => {

        var attr = await Attraction.create(a)
        region.addAttraction(attr)

    })
}

program
    .command('create-days')
    .action(() => {
        createDays().then(d => {
            // console.log(d)
        })
    })

program
    .command('create-events')
    .action(() => {

        // createFiltersMin().then((v) => {
        //     createEventsMin().then(events => {

        //     })
        // })

        // createFiltersFromJson('regions.json').then(r1 => {
        //     createEventsMin().then(events => {

        //     })
        // })

        // var files = []
        // createRegionsFromExcelAssoc('regions_mazowieckie.xlsx', 'regions_mazowieckie.json').then(f1 => {
        //     files.push(f1)
        //     createRegionsFromExcelAssoc('regions_podkarpackie.xlsx', 'regions_podkarpackie.json').then(f2 => {
        //         files.push(f2)
        //         createFiltersFromJsonArray(files).then(r1 => {
        //             createEventsMin().then(events => {

        //             })
        //         })
        //     })
        // })

        // var files = []
        // createRegionsFromExcelAssoc('regions_mazowieckie.xlsx', 'regions_mazowieckie.json').then(f1 => {
        //     files.push(f1)
        //     createRegionsFromExcelAssoc('regions_podkarpackie.xlsx', 'regions_podkarpackie.json').then(f2 => {
        //         files.push(f2)
        //         createRegionsFromExcelAssoc('regions_wielkopolskie.xlsx', 'regions_wielkopolskie.json').then(f3 => {
        //             files.push(f3)
        //             createRegionsFromExcelAssoc('regions_warminsko-mazurskie.xlsx', 'regions_warminsko-mazurskie.json').then(f4 => {
        //                 files.push(f4)
        //                 createRegionsFromExcelAssoc('regions_swietokrzyskie.xlsx', 'regions_swietokrzyskie.json').then(f5 => {
        //                     files.push(f5)
        //                     createRegionsFromExcelAssoc('regions_slaskie.xlsx', 'regions_slaskie.json').then(f6 => {
        //                         files.push(f6)
        //                         createRegionsFromExcelAssoc('regions_pomorskie.xlsx', 'regions_pomorskie.json').then(f7 => {
        //                             files.push(f7)
        //                             createRegionsFromExcelAssoc('regions_opolskie.xlsx', 'regions_opolskie.json').then(f8 => {
        //                                 files.push(f8)
        //                                 createRegionsFromExcelAssoc('regions_malopolskie.xlsx', 'regions_malopolskie.json').then(f9 => {
        //                                     files.push(f9)
        //                                     createRegionsFromExcelAssoc('regions_lodzkie-i-lubelskie.xlsx', 'regions_lodzkie-i-lubelskie.json').then(f10 => {
        //                                         files.push(f10)
        //                                         createRegionsFromExcelAssoc('regions_dolnoslaskie.xlsx', 'regions_dolnoslaskie.json').then(f11 => {
        //                                             files.push(f11)
        //                                             createRegionsFromExcelAssoc('regions_podlaskie.xlsx', 'regions_podlaskie.json').then(f12 => {
        //                                                 files.push(f12)
        //                                                 createRegionsFromExcelAssoc('regions_kujawsko-pomorskie.xlsx', 'regions_kujawsko-pomorskie.json').then(f13 => {
        //                                                     files.push(f13)
        //                                                     createFiltersFromJsonArray(files).then(r1 => {
        //                                                         // createEventsMin(200).then(events => {

        //                                                         // })
        //                                                         ImportRepository.importEvents(paths.root + '/import_data/2020', 5).then(d => {
        //                                                             // console.log(d)
        //                                                             createEventsMin(100).then(events => {


        //                                                             })
        //                                                         })
        //                                                     })

        //                                                 })
        //                                             })
        //                                         })
        //                                     })
        //                                 })
        //                             })
        //                         })
        //                     })
        //                 })
        //             })
        //         })
        //     })

        // })

        ImportRepository.importEvents(paths.root + '/import_data/2020-2', 5).then(d => {
            // console.log(d)
            // createEventsMin(100).then(events => {


            // })
        })

    })


program
    .command('create-events-assoc')
    .action(() => {


        addEventsToCatalog().then((v) => {

            addEventsDays().then(v3 => {

            })

        })


    })


program
    .command('create-events-next')
    .action(() => {


        addEventsToCatalog().then((v) => {
            // createDays().then(v2 => {
            addEventsDays().then(v3 => {

            })
            // })
        })


    })




program
    .command('create-galleries')
    .action(async () => {


        var ages = fs.readFileSync(paths.root + '/commands/galleries.json');
        var d = JSON.parse(ages)
        await Gallery.bulkCreate(d)


    })


// program
//     .command('import-events')
//     .action(() => {

//         ImportRepository.importEvents(paths.root + '/import_data/2020-3', 5).then(d => {
//             // console.log(d)
//             // createEventsMin(100).then(events => {


//             // })
//         })

//     })



async function createLinks() {

    var links = fs.readFileSync(paths.root + '/commands/links.json')
    var ls = JSON.parse(links)

    await map(ls, async (l, i) => {

        var l = await Link.create(l)
        // console.log(l.id, l.title)

    })

}


async function createMenu(fileMenu, fileLinks) {

    var m = fs.readFileSync(paths.root + '/commands/' + fileMenu)
    var mJ = fs.readFileSync(paths.root + '/commands/' + fileLinks)
    var menu = JSON.parse(m)
    var nMenu = Object.assign(menu);
    nMenu[0].linksJson = JSON.stringify(JSON.parse(mJ));

    var mn = await Menu.create(nMenu[0])

    await map(JSON.parse(mJ), async (el) => {
        var ln = await Link.findOne({ where: { id: el.id } })
        await mn.addLink(ln)
    });


}

program
    .command('create-menu')
    .action(() => {

        createLinks().then((v) => {
            createMenu('menu-left.json', 'links_json_left.json').then((v2) => {
                createMenu('menu-right.json', 'links_json_right.json').then(v3 => {
                    createMenu('menu-bottom.json', 'links_json_bottom.json')
                })
            })
        })


    })


async function createSlides() {

    var slides = fs.readFileSync(paths.root + '/commands/slides.json');
    var data = JSON.parse(slides);
    await Slide.bulkCreate(data)

}


program
    .command('create-slides')
    .action(() => {

        createSlides().then(d => {

        })


    })


async function createHomePage() {

    var slides = fs.readFileSync(paths.root + '/commands/homepage.json');
    var data = JSON.parse(slides);
    await HomePage.bulkCreate(data)

}


program
    .command('create-homepage')
    .action(() => {

        createHomePage().then(d => {

        })


    })

async function createLinksTest() {

    var links = fs.readFileSync(paths.root + '/commands/test.json')
    var ls = JSON.parse(links)

    await map(ls, async (l, i) => {

        await Link.create(l)

    })

}


async function makeRecomends() {

    await map(Array(20).fill(), async (nr, i) => {
        await Recomendation.create({
            name: faker.company.companyName(),
            file: '/pdfs/lorem-ipsum.pdf',
            description: faker.lorem.sentence(30, 30),
            status: true,
            ordering: (i + 1)
        })
    })

}


program
    .command('make-recommends')
    .action(() => {

        // makeRecomends()

        var makeRecs = async () => {
            var recs = fs.readFileSync(paths.root + '/commands/recs.json');
            var rs = JSON.parse(recs);

            await map(rs, async (r, i) => {

                var size = sizeOf(paths.root + '/static' + r.image)
                var imageD = {
                    image: r.image,
                    sizeString: size.width + 'x' + size.height
                }

                r.image = imageD

                await Recomendation.create(r)

            })
        }


        makeRecs()

    })



async function makeSchools() {

    var image = '/images/ref_wilsona3.png'

    await map(Array(20).fill(), async (nr, i) => {

        var size = sizeOf(paths.root + '/static' + image)
        var img = {
            image,
            sizeString: size.width + 'x' + size.height
        }

        await Institution.create({
            name: faker.company.companyName(),
            image: img,
            status: true,
            ordering: (i + 1)
        })

    })
}


program
    .command('make-schools')
    .action(() => {

        makeSchools()

    })


async function makeAttachmentsFile() {

    var docs = fs.readFileSync(paths.root + '/commands/docs.json')
    var ds = JSON.parse(docs)

    await map(ds, async (d, i) => {

        await Attachment.create(d)

    })

}

program
    .command('make-attachments')
    .action(() => {

        makeAttachmentsFile()

    })



program
    .command('make-institutions')
    .action(() => {

        var makeInst = async () => {

            var insts = fs.readFileSync(paths.root + '/commands/inst.json')
            var ins = JSON.parse(insts)

            await map(ins, async (d, i) => {

                await Institution.create(d)

            })

        }

        makeInst()

    })




program
    .command('make-institutions-json')
    .action(() => {

        var getInst = async () => {

            var workbook = new Excel.Workbook();
            var worksheet = await workbook.xlsx.readFile(paths.root + '/commands/Zeszyt1.xlsx')

            var els = []

            var i = 1

            await worksheet.eachSheet(async (worksheet2, sheetId) => {

                await worksheet2.eachRow(async (row, rowNumber) => {

                    var sn = row.values[1].trim()
                    var t = row.values[2].trim()
                    var d = row.values[3].trim()

                    var el = {
                        "name": sn,
                        "logo": null,
                        "tourTarget": t,
                        "description": d,
                        "status": true,
                        "ordering": i
                    }

                    els.push(el)

                    i++

                })

            })

            fs.writeFileSync(paths.root + '/commands/inst.json', JSON.stringify(els))

        }

        getInst()
    })


program
    .command('test')
    .action(() => {
        createLinksTest()
        // ElasticSearchRepository.getEventByIndexId(1).then(d => {
        //     console.log(d)
        // })

        // Event.findOne({ where: { id: 4 } }).then(e => {
        //     e.getDays({
        //         order: [[
        //             'daysNumber', 'asc'
        //         ]]
        //     }).then(ds => {
        //         ds.map(d => {
        //             console.log(d.daysNumber)
        //         })
        //     })
        // })

    })


program
    .command('make-index')
    .action(() => {
        //morfologik
        ElasticSearchRepository.deleteCreateIndexMapping('wirtur', 'polish').then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })


    })


program
    .command('make-events-index')

    .action(() => {

        ElasticSearchRepository.indexAllEvents('wirtur').then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })

    })

program
    .command('make-events-index-skip-take <offset> <limit>')
    .action((offset, limit) => {

        ElasticSearchRepository.indexSkipTakeEvents('wirtur', parseInt(offset), parseInt(limit)).then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })

    })

program
    .command('make-index-points')
    .action(() => {
        //morfologik
        ElasticSearchRepository.deleteCreateIndexPointsMapping('points').then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })


    })

program
    .command('make-index-points-data')
    .action(() => {
        //morfologik
        ElasticSearchRepository.indexAllPoints('points').then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })


    })

program
    .command('make-one-event-index')
    .action(() => {

        ElasticSearchRepository.putNewEvent(30, 'wirtur').then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })

    })

program
    .command('create-index-pug')
    .action(() => {

        const html = fs.readFileSync(paths.root + '/dist/browser/index.html').toString('utf8');
        let pugCatalog = html2pug(html, { tabs: true });
        pugCatalog = pugCatalog.replace('app-root', 'app-root(catalog=catalogId)')
        pugCatalog = pugCatalog.replace('href=\'/wyszukiwanie\'', 'href=baseHref')
        fs.writeFileSync(paths.root + '/dist/browser/catalog.pug', pugCatalog)


    })


program
    .command('create-ages-themes')
    .action(async () => {

        var ages = fs.readFileSync(paths.root + '/commands/ages.json');
        var d = JSON.parse(ages)
        await Age.bulkCreate(d)

        await map(Array(30).fill(0), async (v, i) => {

            Theme.create({
                name: faker.commerce.color()
            })

        })

    })




async function makeFilesForAngularCatalogs() {

    var filesList = []
    var resourcesList = []

    var html = fs.readFileSync(paths.root + '/dist/browser/index.html').toString('utf8');
    resourcesList = fs.readdirSync(paths.root + '/dist/browser/', { withFileTypes: true })

    var links = await Link.findAll({
        where: {
            dataType: 'catalog'
        }
    })


    await map(links, async (l, i) => {
        var baseUrl = l.path;
        var filename = l.path.replace(new RegExp('\\/', 'g'), '-')
        var pathRel = FileSystemHelper.getPathRelativeData(baseUrl)

        var catalog = await l.getCatalog()

        var folders = baseUrl.split('/')

        if (folders.length > 1) {

            var pathsScan = FileSystemHelper.createFoldersFromArrayExceptLast(folders, paths.root + '/dist/browser')
            FileSystemHelper.copyFilesFromTo('dist/browser', 'dist/browser/' + pathsScan.relative)
            AngularIndexHelper.createAngularIndexInDirectory('index', PathHelper.pathGet('dist/browser') + pathsScan.relative, catalog.id, 'catalog', baseUrl, pathRel, html, true)

        }
        AngularIndexHelper.createAngularIndexInDirectory(filename, PathHelper.pathGet('dist/browser'), catalog.id, 'catalog', baseUrl, pathRel, html, false)

        filesList.push(filename + '.html')


    })

    var linksM = await Link.findAll({
        where: {
            dataType: 'map'
        }
    })

    await map(linksM, async (l, i) => {

        var baseUrl = l.path;
        var filename = l.path.replace(new RegExp('\\/', 'g'), '-')
        var pathRel = FileSystemHelper.getPathRelativeData(baseUrl)
        var folders = baseUrl.split('/')

        if (folders.length > 1) {

            var pathsScan = FileSystemHelper.createFoldersFromArrayExceptLast(folders, paths.root + '/dist/browser')
            FileSystemHelper.copyFilesFromTo('dist/browser', 'dist/browser/' + pathsScan.relative)
            AngularIndexHelper.createAngularIndexInDirectoryMap('index', PathHelper.pathGet('dist/browser') + pathsScan.relative, catalog.id, 'map', baseUrl, pathRel, html, true)

        }

        AngularIndexHelper.createAngularIndexInDirectoryMap(filename, PathHelper.pathGet('dist/browser'), 'map', baseUrl, pathRel, html, false)


        filesList.push(filename + '.html')


    })


    var catalogs = await Catalog.findAll()

    await map(catalogs, async (c, i) => {
        var htmlContent = ''
        var baseUrl = c.alias;
        var filename = c.alias
        filesList.push(filename + '.html')
        // htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
        // htmlContent = htmlContent.replace('<app-root></app-root>', '<app-root viewType="catalog" catalogId="' + c.id + '"></app-root>')
        fs.writeFileSync(paths.root + '/dist/browser/' + filename + '.html', htmlContent)

        AngularIndexHelper.createAngularIndexInDirectory(filename, PathHelper.pathGet('dist/browser'), c.id, 'catalog', baseUrl, null, html, false)
    })

    return { resourcesList, filesList }

}

program
    .command('create-catalogs-index')
    .action(() => {

        makeFilesForAngularCatalogs().then(r => {
            // console.log(r)
        })


    })



async function createRegionsFromExcelAssoc(file, tofile) {

    var workbook = new Excel.Workbook();
    var worksheet = await workbook.xlsx.readFile(paths.root + '/commands/' + file)

    var data = []


    await worksheet.eachSheet(async (worksheet2, sheetId) => {
        // console.log('sheet', worksheet2.getSheetValues())
        // var sheetData = worksheet2.getSheetValues();
        var i = -1;
        var ic = 0

        await worksheet2.eachRow(async (row, rowNumber) => {

            // console.log(row.cellCount, rowNumber)

            var region;
            // console.log(row.values[1])
            if (row.cellCount == 1 && row.values[1] && row.values[1] != '' && row.values[1] != 'NULL') {
                console.log(typeof row.values[1], row.values[1])
                region = row.values[1].split(',')
                let = rObj = {}
                rObj.name = region[0].trim();
                rObj.alias = slug(region[0], { lower: true })
                rObj.lat = region[1].trim();
                rObj.lng = region[2].trim();
                data.push({ region: rObj, cities: [], attractions: [] })
                i++;
                // console.log('create region', row.values[1])
                ic = 0
            }



            if (row.cellCount == 2 && row.values[2] && row.values[2] != '' && row.values[2] != 'NULL') {
                // console.log(typeof row.values[2], row.values[2])
                var city;
                city = row.values[2].split(',')
                let = cObj = {}
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
                if (row.values[2] && row.values[2] != '' && row.values[2] != 'NULL') {
                    city = row.values[2].split(',')
                    let = cObj = {}
                    cObj.name = city[0];
                    cObj.alias = slug(city[0], { lower: true })
                    cObj.lat = city[1];
                    cObj.lng = city[2];
                    cObj.attractions = []
                    data[i].cities.push(cObj)
                    var oldIc = Object.assign(ic);
                    ic++


                    for (var j = 3; j <= cellsCount; j++) {
                        if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL') {
                            // console.log(typeof row.values[j], row.values[j])
                            attr = row.values[j].split(',')
                            let = aObj = {}
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
                        if (row.values[j] && row.values[j] != '' && row.values[j] != 'NULL') {
                            attr = row.values[j].split(',')
                            let = aObj = {}
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

    fs.writeFileSync(__dirname + '/' + tofile, JSON.stringify(data))
    return tofile;


}

program
    .command('get-regions')
    .action(() => {
        var files = []
        createRegionsFromExcelAssoc('regions_mazowieckie.xlsx', 'regions_mazowieckie.json').then(f1 => {
            files.push(f1)
            createRegionsFromExcelAssoc('regions_podkarpackie.xlsx', 'regions_podkarpackie.json').then(f2 => {
                files.push(f2)
                createRegionsFromExcelAssoc('regions_wielkopolskie.xlsx', 'regions_wielkopolskie.json').then(f3 => {
                    files.push(f3)
                    createRegionsFromExcelAssoc('regions_warminsko-mazurskie.xlsx', 'regions_warminsko-mazurskie.json').then(f4 => {
                        files.push(f4)
                        createRegionsFromExcelAssoc('regions_swietokrzyskie.xlsx', 'regions_swietokrzyskie.json').then(f5 => {
                            files.push(f5)
                            createRegionsFromExcelAssoc('regions_slaskie.xlsx', 'regions_slaskie.json').then(f6 => {
                                files.push(f6)
                                createRegionsFromExcelAssoc('regions_pomorskie.xlsx', 'regions_pomorskie.json').then(f7 => {
                                    files.push(f7)
                                    createRegionsFromExcelAssoc('regions_opolskie.xlsx', 'regions_opolskie.json').then(f8 => {
                                        files.push(f8)
                                        createRegionsFromExcelAssoc('regions_malopolskie.xlsx', 'regions_malopolskie.json').then(f9 => {
                                            files.push(f9)
                                            createRegionsFromExcelAssoc('regions_lodzkie-i-lubelskie.xlsx', 'regions_lodzkie-i-lubelskie.json').then(f10 => {
                                                files.push(f10)
                                                createRegionsFromExcelAssoc('regions_dolnoslaskie.xlsx', 'regions_dolnoslaskie.json').then(f11 => {
                                                    files.push(f11)
                                                    createRegionsFromExcelAssoc('regions_podlaskie.xlsx', 'regions_podlaskie.json').then(f12 => {
                                                        files.push(f12)
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })


        // var workbook = new Excel.Workbook();
        // workbook.xlsx.readFile(__dirname + '/regions.xlsx')
        //     .then(function (worksheet) {

        //         worksheet.eachSheet((worksheet2, sheetId) => {
        //             // console.log('sheet', worksheet2.getSheetValues())
        //             var sheetData = worksheet2.getSheetValues();

        //             var region;
        //             worksheet2.eachRow((row, rowNumber) => {
        //                 // console.log(row.values[1])
        //                 if (row.values[1]) {
        //                     region = row.values[1]
        //                     console.log('create region', row.values[1])
        //                 } else {
        //                     var city;
        //                     if (row.values[2]) {
        //                         city = row.values[2]
        //                         console.log('create city for ' + region, row.values[2])
        //                     }
        //                     var attr
        //                     if (row.values[3]) {
        //                         attr = row.values[3]
        //                         console.log('create attr for ' + region, row.values[3])
        //                     }
        //                 }
        //             })

        //         })

        //     })

    })


async function exportRegions() {
    var regs = await Region.findAll()

    var workbook = new Excel.Workbook();

    var worksheet = workbook.addWorksheet('Regiony', {});

    worksheet.columns = [
        { header: 'ID' },
        { header: 'region' }

    ];


    regs.forEach(r => {
        var rowValues = [];
        rowValues[1] = r.id
        rowValues[2] = r.name
        worksheet.addRow(rowValues);
    })

    return workbook



    workbook.xlsx.writeFile(__dirname + '/test.xlsx')

}

async function exportCity(workbook) {

    var cs = await City.findAll({
        order: [
            ['name', 'ASC']
        ]
    })

    var worksheet = workbook.addWorksheet('Miasta', {});

    worksheet.columns = [
        { header: 'ID' },
        { header: 'miasto' }

    ];


    cs.forEach(c => {
        var rowValues = [];
        rowValues[1] = c.id
        rowValues[2] = c.name
        worksheet.addRow(rowValues);
    })

    return workbook


}


async function exportAttractions(workbook) {

    var ats = await Attraction.findAll({
        order: [
            ['name', 'ASC']
        ]
    })

    var worksheet = workbook.addWorksheet('Atrakcje', {});

    worksheet.columns = [
        { header: 'ID' },
        { header: 'atrakcja' }
    ];


    ats.forEach(a => {
        var rowValues = [];
        rowValues[1] = a.id
        rowValues[2] = a.name
        worksheet.addRow(rowValues);
    })

    return workbook



    // workbook.xlsx.writeFile(__dirname + '/test.xlsx')

}

async function exportThemes(workbook) {

    var ats = await Theme.findAll({
        order: [
            ['name', 'ASC']
        ]
    })

    var worksheet = workbook.addWorksheet('Tematy', {});

    worksheet.columns = [
        { header: 'ID' },
        { header: 'temat' }
    ];


    ats.forEach(a => {
        var rowValues = [];
        rowValues[1] = a.id
        rowValues[2] = a.name
        worksheet.addRow(rowValues);
    })

    return workbook


    // workbook.xlsx.writeFile(__dirname + '/test.xlsx')

}

async function exportAges(workbook) {

    var ats = await Age.findAll({
        order: [
            ['from', 'ASC']
        ]
    })

    var worksheet = workbook.addWorksheet('Przedziały wiekowe', {});

    worksheet.columns = [
        { header: 'ID' },
        { header: 'od' },
        { header: 'do' }
    ];


    ats.forEach(a => {
        var rowValues = [];
        rowValues[1] = a.id
        rowValues[2] = a.from
        rowValues[3] = a.two
        worksheet.addRow(rowValues);
    })

    // return workbook


    workbook.xlsx.writeFile(paths.root + '/import_data/filters.xlsx')

}


program
    .command('export-filters')
    .action(() => {
        exportRegions().then(workbook => {
            exportCity(workbook).then(workbook2 => {
                exportAttractions(workbook2).then(workbook3 => {
                    exportThemes(workbook3).then(workbook4 => {
                        exportAges(workbook4).then(workbook5 => {

                        })
                    })
                })
            })
        })
    })

program
    .command('import-events')
    .option('<catalog> <catalogId>')
    .action((catalog, catalogId) => {
        ImportRepository.importEvents('../import_data/' + catalog, catalogId).then(d => {
            console.log(d)
        })
    })


program
    .command('test-price')
    .action(() => {
        ImportRepository.getPriceConfig('test_price.xlsx', 'commands').then(d => {
            console.log(d)
            fs.writeFileSync('./test_price.json', JSON.stringify(d))
        })
    })

program
    .command('import-price')
    .option('<evId> <fPath>')
    .action((evId, fPath) => {
        console.log(evId, fPath)
    })


program
    .command('refactor-prices')
    .action(() => {

        var createNewPrice = (pc) => {
            var npc = []
            var n = []
            pc.map(c => {
                n.push({
                    from: c.from,
                    to: c.top,
                    price: c.price,
                    days: c.days
                })
            })
            npc.push({
                groupName: "",
                groupDesc: "",
                prices: n
            })
            return npc
        }

        var changePrices = async () => {
            var events = await Event.findAll()
            await map(events, async (ev, i) => {
                if (ev.priceConfig && ev.priceConfig != '') {
                    ev.priceConfig = createNewPrice(ev.priceConfig)
                    await ev.save()
                }
            })
        }

        changePrices()
    })


async function createRecomendations() {

    var rec = {
        file: '/pdfs/lorem-ipsum.pdf'
    }

    await map(Array(20).fill(1), async (n, i) => {

        rec.name = faker.company.companyName()
        rec.description = faker.lorem.sentence(10, 30)
        rec.status = true
        rec.ordering = (i + 1)
        await Recomendation.create(rec)

    })

}

program
    .command('create-recomendations')
    .action(() => {
        createRecomendations().then(r => {

        })
    })

async function createInstitutions() {

    var d = {
        image: {
            image: '/images/ref_wilsona3.png',
            sizeString: '421x600'
        }
    }

    await map(Array(20).fill(1), async (n, i) => {

        d.name = faker.company.companyName()
        d.description = faker.lorem.sentence(10, 70)
        d.status = true
        d.ordering = (i + 1)
        await Institution.create(d)

    })

}

program
    .command('create-institution')
    .action(() => {
        createInstitutions()
    })

async function makeAttachments() {
    var d = {
        files: [
            {
                path: '/pdfs/events.ods',
                name: 'Wydarzenia',
                iconType: 'excel'
            },
            {
                path: '/pdfs/filters.xlsx',
                name: 'Filtry',
                iconType: 'excel'
            },
            {
                path: '/pdfs/lorem-ipsum.pdf',
                name: 'Regulamin',
                iconType: 'pdf'
            },
            {
                path: '/pdfs/plik-word.docx',
                name: 'Oświadczenie',
                iconType: 'word'
            }
        ]
    }

    d.groupName = 'Dokumenty'
    d.description = faker.lorem.sentence(10, 70)
    d.status = true
    d.ordering = 1
    await Attachment.create(d)

    // await map(Array(1).fill(1), async (n, i) => {



    // })

}

program
    .command('create-attachments')
    .action(() => {
        makeAttachments()
    })




program
    .command('insert-regions')
    .action(() => {
        var insert = [
            'regions_mazowieckie.xlsx',
            'regions_podkarpackie.xlsx',
            'regions_wielkopolskie.xlsx',
            'regions_warminsko-mazurskie.xlsx',
            'regions_swietokrzyskie.xlsx',
            'regions_slaskie.xlsx',
            'regions_pomorskie.xlsx',
            'regions_opolskie.xlsx',
            'regions_malopolskie.xlsx',
            'regions_lodzkie-i-lubelskie.xlsx',
            'regions_dolnoslaskie.xlsx',
            'regions_podlaskie.xlsx',
            'regions_kujawsko-pomorskie.xlsx'
        ]

        UpdateFiltersRepository.createFiltersFromArray(insert)

        // UpdateFiltersRepository.createRegionsFromExcelAssoc('regions_2020.xlsx', 'regions_2020.json')
    })

program
    .command('insert-regions-find-old')
    .action(() => {

        //'citiesIds.xlsx'
        // UpdateFiltersRepository.createJsonFromIdsExcel('attractionsIds.xlsx')

        // var insert = [
        //     'regions_mazowieckie.xlsx',
        //     'regions_podkarpackie.xlsx',
        //     'regions_wielkopolskie.xlsx',
        //     'regions_warminsko-mazurskie.xlsx',
        //     'regions_swietokrzyskie.xlsx',
        //     'regions_slaskie.xlsx',
        //     'regions_pomorskie.xlsx',
        //     'regions_opolskie.xlsx',
        //     'regions_malopolskie.xlsx',
        //     'regions_lodzkie-i-lubelskie.xlsx',
        //     'regions_dolnoslaskie.xlsx',
        //     'regions_podlaskie.xlsx',
        //     'regions_kujawsko-pomorskie.xlsx'
        // ]

        // var citiesIds = fs.readFileSync(paths.root + '/commands/new_jsons/citiesIds.json')
        // citiesIds = JSON.parse(citiesIds)
        // var attractionsIds = fs.readFileSync(paths.root + '/commands/new_jsons/attractionsIds.json')
        // attractionsIds = JSON.parse(attractionsIds)

        // UpdateFiltersRepository.createFiltersFromArrayFindOld(insert, citiesIds, attractionsIds)
        // UpdateFiltersRepository.createRegionsFromExcelAssoc('regions_2020.xlsx', 'regions_2020.json')

        var insertJson = [
            'regions_mazowieckie.json',
            'regions_podkarpackie.json',
            'regions_wielkopolskie.json',
            'regions_warminsko-mazurskie.json',
            'regions_swietokrzyskie.json',
            'regions_slaskie.json',
            'regions_pomorskie.json',
            'regions_opolskie.json',
            'regions_malopolskie.json',
            'regions_lodzkie-i-lubelskie.json',
            'regions_dolnoslaskie.json',
            'regions_podlaskie.json',
            'regions_kujawsko-pomorskie.json'
        ]


        UpdateFiltersRepository.createFiltersFromJsonArray(insertJson)



    })



program
    .command('update-regions')
    .action(() => {
        UpdateFiltersRepository.updateFiltersToRegion(1, 'update_mazowieckie.xlsx').then(r1 => {
            UpdateFiltersRepository.updateFiltersToRegion(7, 'update_pomorskie.xlsx').then(r2 => {
                UpdateFiltersRepository.updateFiltersToRegion(6, 'update_swietokrzyskie.xlsx').then(r3 => {
                    UpdateFiltersRepository.updateFiltersToRegion(4, 'update_warminsko-mazurskie.xlsx').then(r4 => {
                        UpdateFiltersRepository.updateFiltersToRegion(3, 'update_wielkopolskie.xlsx').then(r5 => {

                        })
                    })
                })
            })
        })
    })

program
    .command('update-regions-check-exists')
    .action(() => {
        UpdateFiltersRepository.updateFiltersToRegionCheckExists(1, '1-mazowieckie.xlsx').then(r1 => {
            UpdateFiltersRepository.updateFiltersToRegionCheckExists(3, '3-wielkopolskie.xlsx').then(r1 => {
                UpdateFiltersRepository.updateFiltersToRegionCheckExists(4, '4-warminsko-mazurskie.xlsx').then(r1 => {
                    UpdateFiltersRepository.updateFiltersToRegionCheckExists(5, '5-swietokrzyskie.xlsx').then(r1 => {
                        UpdateFiltersRepository.updateFiltersToRegionCheckExists(6, '6-slaskie.xlsx').then(r1 => {
                            UpdateFiltersRepository.updateFiltersToRegionCheckExists(7, '7-pomorskie.xlsx').then(r1 => {
                                UpdateFiltersRepository.updateFiltersToRegionCheckExists(9, '9-malopolskie.xlsx').then(r1 => {
                                    UpdateFiltersRepository.updateFiltersToRegionCheckExists(10, '10-lodzkie.xlsx').then(r1 => {
                                        UpdateFiltersRepository.updateFiltersToRegionCheckExists(11, '11-lubleskie.xlsx').then(r1 => {
                                            UpdateFiltersRepository.updateFiltersToRegionCheckExists(12, '12-dolnoslaskie.xlsx').then(r1 => {
                                                UpdateFiltersRepository.updateFiltersToRegionCheckExists(13, '13-podlaskie.xlsx').then(r1 => {
                                                    UpdateFiltersRepository.updateFiltersToRegionCheckExists(14, '14-kujawsko-pomorskie.xlsx').then(r1 => {

                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })





program.parse(process.argv)