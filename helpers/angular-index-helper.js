const PathHelper = require('./paths-helper');
const paths = require('../paths')
const fs = require('fs');
const Link = require('../models/index').Link
const Catalog = require('../models/index').Catalog
const {
    map
} = require('p-iteration');
const FileSystemHelper = require('./file-system-helper')

class AngularIndexHelper {

    static createAngularIndexInDirectory(filename, destinationPath, catalogId, type, baseUrl, pathRel, html, isRelativePath) {
        var htmlContent = ''
        htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
        if (isRelativePath) {
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="' + pathRel.prefix)
            htmlContent = htmlContent.replace(new RegExp('\<script type\=\"text\/javascript\" src\=\"', 'g'), '<script type="text/javascript" src="' + pathRel.prefix)
        }
        var newRoot = '<app-root viewType="' + type + '" '
        newRoot += (type == "catalog") ? 'catalogId="' + catalogId + '"' : ''
        newRoot += ' type="template"'

        htmlContent = htmlContent.replace('<app-root', newRoot)
        if (fs.existsSync(destinationPath + filename + '.html'))
            fs.unlinkSync(destinationPath + filename + '.html')
        htmlContent = fs.writeFileSync(destinationPath + filename + '.html', htmlContent)
    }

    // static createAngularIndexInDirectoryTemplateOnly(filename, destinationPath, catalogId, type, baseUrl, pathRel, html, isRelativePath) {
    //     var htmlContent = ''
    //     htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
    //     if (isRelativePath) {
    //         htmlContent = htmlContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="' + pathRel.prefix)
    //         htmlContent = htmlContent.replace(new RegExp('\<script type\=\"text\/javascript\" src\=\"', 'g'), '<script type="text/javascript" src="' + pathRel.prefix)
    //     }
    //     var newRoot = '<app-root viewType="' + type + '" '
    //     newRoot += (type == "catalog") ? 'catalogId="' + catalogId + '"' : ''
    //     newRoot += ' type="template"'

    //     htmlContent = htmlContent.replace('<app-root', newRoot)
    //     if (fs.existsSync(destinationPath + filename + '.html'))
    //         fs.unlinkSync(destinationPath + filename + '.html')
    //     htmlContent = fs.writeFileSync(destinationPath + filename + '.html', htmlContent)
    // }

    static createAngularIndexInDirectoryMap(filename, destinationPath, type, baseUrl, pathRel, html, isRelativePath) {
        var htmlContent = ''
        // htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
        htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/">')
        if (isRelativePath) {
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="' + pathRel.prefix)
            htmlContent = htmlContent.replace(new RegExp('\<script type\=\"text\/javascript\" src\=\"', 'g'), '<script type="text/javascript" src="' + pathRel.prefix)
        }
        var newRoot = '<app-root viewType="' + type + '" '


        htmlContent = htmlContent.replace('<app-root', newRoot)
        if (fs.existsSync(destinationPath + filename + '.html'))
            fs.unlinkSync(destinationPath + filename + '.html')
        htmlContent = fs.writeFileSync(destinationPath + filename + '.html', htmlContent)
    }


    async makeFilesForAngularCatalogs() {

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

            if (catalog) {

                if (folders.length > 1) {

                    var pathsScan = FileSystemHelper.createFoldersFromArrayExceptLast(folders, paths.root + '/dist/browser')
                    FileSystemHelper.copyFilesFromTo('dist/browser', 'dist/browser/' + pathsScan.relative)
                    AngularIndexHelper.createAngularIndexInDirectory('index', PathHelper.pathGet('dist/browser') + pathsScan.relative, catalog.id, 'catalog', baseUrl, pathRel, html, true)

                }
                AngularIndexHelper.createAngularIndexInDirectory(filename, PathHelper.pathGet('dist/browser'), catalog.id, 'catalog', baseUrl, pathRel, html, false)

            }
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

}

module.exports = AngularIndexHelper