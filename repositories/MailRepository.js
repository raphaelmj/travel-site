const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail')
const paths = require('../paths')
const { pugEngine } = require("nodemailer-pug-engine");

class MailRepository {


    async makeTransporterUsePug() {
        let transporter = await nodemailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            secure: mailConfig.secure,
            auth: {
                user: mailConfig.user,
                pass: mailConfig.pass
            }
        });

        transporter.use('compile', pugEngine({
            templateDir: paths.root + '/views',
            pretty: true
        }));

        return transporter
    }



    async sendEmailQuestion(data) {

        var transporter = await this.makeTransporterUsePug()

        // console.log(data)

        return await transporter.sendMail({
            from: '"' + mailConfig.who + '" <' + mailConfig.from + '>',
            to: mailConfig.to,
            template: 'emails/question',
            subject: 'Zapytanie ze strony',
            // text:"",
            ctx: data
        })
    }


    async sendEmailOther(data) {

        var transporter = await this.makeTransporterUsePug()

        // console.log(data)

        return await transporter.sendMail({
            from: '"' + mailConfig.who + '" <' + mailConfig.from + '>',
            to: mailConfig.to,
            template: 'emails/others',
            subject: 'Zapytanie ze strony',
            // text:"",
            ctx: data
        })
    }


}


module.exports = new MailRepository()