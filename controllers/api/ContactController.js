const fs = require('fs');
const nodemailer = require('nodemailer');
const MailRepository = require('../../repositories/MailRepository')
const DocsRepository = require('../../repositories/DocsRepository')

class ContactController {

    insertInToBase(req, res, next) {
        DocsRepository.inserQuestionToDocs(req.body).then(r => {
            next()
        })
    }

    questionSend(req, res) {

        MailRepository.sendEmailQuestion(req.body).then(r => {
            return res.json({ r, token: true, success: true })
        })
    }

}

module.exports = new ContactController()