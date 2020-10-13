const StreamZip = require('node-stream-zip');
const fs = require('fs')
const paths = require('../../paths')
const {
    map
} = require('p-iteration');
const ImportRepository = require('../../repositories/ImportRepository')

class UpdateFilesController {


    zipFileAfterUpload(req, res) {

        const zip = new StreamZip({
            file: req.pathFile,
            storeEntries: true
        });

        zip.on('ready', () => {
            zip.extract(null, req.pathFolder + '/', err => {
                console.log(err ? err : 'Extracted');
                zip.close();
                var folder = req.pathFolder.replace('./import_events/', '')
                return res.json(folder)
            });
        });


    }


    getEventUplaodFolders(req, res) {

        var uplaodData = async () => {


            await UpdateFilesController.clearEmptyFolders('./import_events')

            var folders = await fs.readdirSync('./import_events')
            var trueFolders = []

            await map(folders, async (fl) => {
                var bool = false
                if (await fs.existsSync('./import_events/' + fl)) {
                    if (await fs.lstatSync('./import_events/' + fl).isDirectory()) {
                        var inFolder = fs.readdirSync('./import_events/' + fl)
                        inFolder.map(f => {
                            if (f == 'events.xlsx') {
                                bool = true
                            }
                        })
                        if (bool) {
                            trueFolders.push(fl)
                        }
                    }
                }
            })
            trueFolders = trueFolders.sort(function (a, b) {
                return fs.statSync('./import_events/' + b).mtime.getTime() -
                    fs.statSync('./import_events/' + a).mtime.getTime();
            });
            return trueFolders
        }


        uplaodData().then(r => {
            return res.json(r)
        })


    }


    removeEventsDir(req, res) {

        const removeFolder = async () => {

            await UpdateFilesController.clearEmptyFolders('./import_events')

            if (req.body.folder && req.body.folder != "" && req.body.folder != "/") {
                if (await fs.existsSync('./import_events/' + req.body.folder)) {
                    await fs.rmdirSync('./import_events/' + req.body.folder, { recursive: true })
                }
            }
            return {}
        }


        removeFolder().then(r => {
            return res.json({ success: Boolean(req.body.folder && req.body.folder != "" && req.body.folder != "/") })
        })


    }


    static async clearEmptyFolders(rootFolder) {
        var folders = fs.readdirSync(rootFolder)
        await map(folders, async (fl) => {
            if (await fs.existsSync('./import_events/' + fl)) {
                var inFolder = await fs.readdirSync('./import_events/' + fl)
                if (inFolder.length < 1) {
                    await fs.rmdirSync('./import_events/' + fl)
                }
            }
        })
    }

    updateFolderEvents(req, res) {
        ImportRepository.importEvents(paths.root + '/import_events/' + req.body.folder, req.body.catalogId).then(r => {
            return res.json(r)
        })

    }

}


module.exports = new UpdateFilesController()