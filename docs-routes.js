const router = require('express').Router();
const DocsController = require('./controllers/api/DocsController')
const MediaRepository = require("./repositories/MediaRepository")
const ContactController = require('./controllers/api/ContactController')
const RecaptchaMiddleware = require('./middlewares/recaptcha-middleware')
const authmiddleware = require('./middlewares/admin/authmiddleware')

var upload = MediaRepository.prepareFileStorageSimpleUpload();


router.post('/send/file/:type', upload.single('doc'), /*RecaptchaMiddleware.checkReCaptchaToken,*/ DocsController.getDocument, DocsController.emailSend)
router.get('/file/:tokenUrl/:docName', authmiddleware, DocsController.showFile)
router.post('/question/send', /*RecaptchaMiddleware.checkReCaptchaToken,*/ContactController.insertInToBase, ContactController.questionSend)

router.post('/get/docs', authmiddleware, DocsController.getDocByQuery)



module.exports = router;