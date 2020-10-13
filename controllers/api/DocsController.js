const Catalog = require("../../models/index").Catalog
const Doc = require("../../models/index").Doc
const Docdata = require("../../models/index").Docdata
const DocsRepository = require('../../repositories/DocsRepository')
const MailRepository = require('../../repositories/MailRepository')
const fs = require('fs');

class DocsController {

    getDocument(req, res, next) {
        DocsRepository.createDocFromFileData(req.fileData, './tmp', req.params.type, req.body).then(doc => {
            // return res.json(doc.dataValues)
            next()
        })
    }


    showFile(req, res) {
        DocsRepository.getDocFileData(req.params.tokenUrl).then(d => {

            if (!d) {
                return res.sendStatus(404);
            }


            var buffer = Buffer.from(d.docdata.data, 'base64')
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Content-type', d.doc.mimeType);
            res.send(buffer)
            res.end();
            // return res.json(d)
        })

    }

    getDocByQuery(req, res) {
        DocsRepository.getDocsByQuery(req.body).then(r => {
            return res.json(r)
        })
    }

    emailSend(req, res) {

        MailRepository.sendEmailOther(req.body).then(r => {
            return res.json({ r, token: true, success: true })
        })
    }

}

module.exports = new DocsController()