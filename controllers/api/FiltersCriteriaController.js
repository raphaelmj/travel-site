const CriteriaRepository = require('../../repositories/CriteriaRepository');
const cache = require('../../config/cache');
const RegionRepository = require('../../repositories/RegionRepository')
const CityRepository = require('../../repositories/CityRepository')
const AttractionRepository = require('../../repositories/AttractionRepository')
const Region = require('../../models/index').Region
const City = require('../../models/index').City
const Day = require('../../models/index').Day
const Theme = require('../../models/index').Theme
const Age = require('../../models/index').Age

class FiltersCriteriaController {

    getRegions(req, res) {
        Region.findAll().then(r => {
            return res.json(r)
        })
    }

    getCities(req, res) {
        City.findAll().then(r => {
            return res.json(r)
        })
    }

    getGeoFiltersCriteria(req, res) {
        CriteriaRepository.getGeoCriteria().then(fls => {
            return res.json(fls)
        })
    }

    createRegion(req, res) {
        RegionRepository.createRegion(req.body).then(r => {
            return res.json(r)
        })

    }

    updateFilterCity(req, res) {
        CityRepository.updateCity(req.body.city, req.body.regionId).then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })

    }

    createFilterCity(req, res) {
        CityRepository.createCity(req.body.city, req.body.regionId).then(city => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(city)
                })
            })

        })
    }

    deleteFilterCity(req, res) {

        CityRepository.deleteCity(req.params.id).then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })

        })
    }



    updateFilterAttraction(req, res) {
        AttractionRepository.updateAttraction(req.body.attraction, req.body.region, req.body.city).then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })
    }

    createFilterAttraction(req, res) {
        AttractionRepository.createAttraction(req.body.attraction, req.body.region, req.body.city).then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })
    }

    deleteFilterAttraction(req, res) {
        AttractionRepository.deleteAttraction(req.params.id).then(r => {
            CriteriaRepository.getCriteria().then(cs => {
                cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                    return res.json(r)
                })
            })
        })
    }


    updateRegion(req, res) {
        RegionRepository.updateRegion(req.body).then(r => {
            return res.json(r)
        })
    }

    getRegionCities(req, res) {
        RegionRepository.getRegionCities(req.params.id).then(r => {
            return res.json(r)
        })
    }

    getRegionAttractions(req, res) {
        RegionRepository.getRegionAttractions(req.params.id).then(r => {
            return res.json(r)
        })
    }

    getDays(req, res) {
        Day.findAll().then(ds => {
            return res.json(ds)
        })
    }

    getAges(req, res) {
        Age.findAll().then(ds => {
            return res.json(ds)
        })
    }


    getThemes(req, res) {
        Theme.findAll().then(ds => {
            return res.json(ds)
        })
    }


    createDay(req, res) {
        CriteriaRepository.createDay(req.body.day).then(r => {
            return res.json(r)
        })
    }

    updateDay(req, res) {
        CriteriaRepository.updateDay(req.body.day).then(r => {
            return res.json(r)
        })
    }

    deleteDay(req, res) {
        CriteriaRepository.deleteDay(req.params.id).then(r => {
            return res.json(r)
        })
    }


    createAge(req, res) {
        CriteriaRepository.createAge(req.body.age).then(r => {
            return res.json(r)
        })
    }

    updateAge(req, res) {
        CriteriaRepository.updateAge(req.body.age).then(r => {
            return res.json(r)
        })
    }

    deleteAge(req, res) {
        CriteriaRepository.deleteAge(req.params.id).then(r => {
            return res.json(r)
        })
    }


    createTheme(req, res) {
        CriteriaRepository.createTheme(req.body.theme).then(r => {
            return res.json(r)
        })
    }


    updateTheme(req, res) {
        CriteriaRepository.updateTheme(req.body.theme).then(r => {
            return res.json(r)
        })
    }


    deleteTheme(req, res) {
        CriteriaRepository.deleteTheme(req.params.id).then(r => {
            return res.json(r)
        })
    }


}


module.exports = new FiltersCriteriaController()