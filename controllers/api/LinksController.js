const Link = require("../../models/index").Link
const LinkRepository = require("../../repositories/LinkRepository")
const MenuRepository = require("../../repositories/MenuRepository")
const ResourcesRepository = require("../../repositories/ResourcesRepository")
var slugify = require('slugify')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class LinksController {

    getLinksList(req, res) {
        Link.findAll().then((links) => {
            // console.log(links.length)
            return res.json(links);
        })
    }



    createNewLink(req, res) {
        LinkRepository.createNewLink(req.body).then(data => {
            return res.json(req.body)
        })

    }

    getTree(req, res) {
        MenuRepository.getLinksTree().then(data => {
            return res.json(data)
        })
    }

    changeLinksOrder(req, res) {
        const data = req.body;
        LinkRepository.linkOrderReBuild(data).then(response => {
            return res.json(req.body)
        })
    }

    getLinkResource(req, res) {
        LinkRepository.getLinkData(req.params.id).then(d => {
            // console.log(d)
            return res.json(d)
        }).catch(err => {
            return res.json(err)
        })

    }

    getResourcesData(req, res) {
        ResourcesRepository.getFullResorcesArray().then(data => {
            return res.json(data)
        })
    }

    checkIsPathFree(req, res) {
        LinkRepository.isPathExist(req.body.path, req.body.oldPath).then(d => {
            return res.json(d);
        })
    }

    updateLinkData(req, res, next) {
        // return res.json(req.body)
        LinkRepository.updateLinkDataByType(req.body).then(d => {
            req.link = d;
            // return res.json(d)
            next()
        })

    }

    updateMenusAfterLinkChange(req, res) {

        MenuRepository.recurranceMenuJsonUpdate(req.link, req.link.Menus).then(d => {
            return res.json(d)
        })

    }

    linkUpdateType(req, res, next) {
        LinkRepository.updateLinkDataType(req.body).then(d => {
            req.link = d;
            next()
            // return res.json(d)
        })
    }

    updateMenusAfterLinkChangeType(req, res) {
        MenuRepository.recurranceMenuJsonUpdateType(req.link, req.link.menu).then(d => {
            return res.json(d)
        })
    }


    getLinksListFullData(req, res) {
        LinkRepository.getLinksWithDataFull().then((links) => {
            return res.json(links);
        })
    }

    removeLinkRefactor(req, res) {
        LinkRepository.removeLinkTreeRefactor(req.body).then((d) => {
            return res.json(d);
        })
    }

    getLinksContent(req, res) {
        Link.findAll({ where: { dataType: { [Op.or]: ['content', 'custom'] } } }).then(ls => {
            return res.json(ls)
        })
    }

    updateLinkContent(req, res) {
        Link.update({ content: req.body.content }, { where: { id: req.body.id } }).then(r => {
            return res.json(r)
        })
    }

}

module.exports = new LinksController()