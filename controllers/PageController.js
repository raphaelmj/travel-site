const MenuRepository = require('../repositories/MenuRepository');
const cache = require('../config/cache');
var ParseHelper = require('../helpers/parse-helper');
const fs = require('fs')
const parser = new ParseHelper()
var moment = require('moment');
const paths = require('../paths')

class PageController {

    indexPage(req, res) {


        var canonical = ParseHelper.getCanonical(req.path);

        var oUrl = req.originalUrl
        oUrl = oUrl.substr(1, oUrl.length - 1)

        var menus = req.menus;
        menus[0] = ParseHelper.replaceToCurrentActiveMenu(menus[0], oUrl)
        menus[1] = ParseHelper.replaceToCurrentActiveMenu(menus[1], oUrl)
        req.isCookie = Boolean(req.cookies.rConfirm)
        // console.log(req.isCookie)

        return PageController.switchToResourceView(req, res, canonical, menus);



    }





    static switchToResourceView(req, res, canonical, menus) {

        var url = req.protocol + '://' + req.hostname + req.path;
        var domain = req.protocol + '://' + req.hostname;

        // return res.json(req.toView)
        // return res.json(req.widgetsGroup)

        switch (req.toView.data.dataType) {

            case 'article':

                // return res.json(req.toView)

                return res.render('./views/resources/article', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus,
                    article: req.toView.resource,
                    currentCatalog: req.toView.resource.currentCatalog,
                    path: req.path,
                    url,
                    domain,
                    link: req.toView.link,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    microGallery: req.toView.resource.microGallery
                })

                break;

            case 'articles':


                // return res.json(req.toView)
                // return res.json(breadc)
                // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
                return res.render('./views/resources/articles', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus,
                    currentCatalog: req.toView.resource.currentCatalog,
                    articles: req.toView.resource.articles,
                    path: req.path,
                    category: req.toView.resource.category,
                    url,
                    domain,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.link
                })

                break;


            case 'category':

                // return res.json(breadc)
                // return res.json(req.toView)

                // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
                return res.render('./views/resources/category-two-columns', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus,
                    partners: req.partners,
                    category: req.toView.data.category,
                    currentCatalog: req.toView.resource.currentCatalog,
                    blog: {
                        articles: req.toView.resource.data.rows,
                        total: req.toView.resource.data.count,
                        offset: req.toView.resource.offset,
                        limit: req.toView.resource.limit
                    },
                    path: req.path,
                    page: (req.query.page) ? req.query.page : 1,
                    url,
                    domain,
                    category: req.toView.resource.category,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break;

            case 'events':

                // return res.json(req.toView)

                return res.render('./views/resources/events-index', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    domain,
                    partners: req.partners,
                    all: (req.query.all == ''),
                    link: req.toView.data.link,
                    events: req.toView.resource.events.hits.hits,
                    catalog: req.toView.resource.catalog,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break;


            case 'event':

                // return res.json(req.toView)
                // return res.json(req.toView.resource.currentCatalog)
                return res.render('./views/resources/event-modern', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    domain,
                    partners: req.partners,
                    event: req.toView.resource.event,
                    eventBase: req.toView.resource.ev,
                    link: req.toView.data.link,
                    event: req.toView.resource.event,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break;

            case 'catalog':

                // return res.json(req.toView)

                var filename = 'index';
                if (req.toView.data.searchFor == 'link') {
                    filename = req.toView.data.link.path.replace(new RegExp('\\/', 'g'), '-')
                } else {
                    if (req.toView.resource.catalog)
                        filename = req.toView.resource.catalog.alias
                }

                var baseHref = canonical;

                if (baseHref.substr(-1, 1) == '/') {
                    baseHref = baseHref.substr(0, canonical.length - 1)
                }

                // console.log(typeof req.toView.resource.catalog)

                if (req.toView.resource.catalog && !req.query.catalog) {
                    return res.redirect(301, baseHref + "/?catalog=" + req.toView.resource.catalog.id + '&only=template')
                }

                return res.render('./dist/browser/' + filename + '.html', {
                    req: req,
                    res: res
                });


                break;


            case 'catalog_template':

                var filename = 'index';
                if (req.toView.data.searchFor == 'link') {
                    filename = req.toView.data.link.path.replace(new RegExp('\\/', 'g'), '-')
                } else {
                    if (req.toView.resource.catalog)
                        filename = req.toView.resource.catalog.alias
                }

                var baseHref = canonical;

                if (baseHref.substr(-1, 1) == '/') {
                    baseHref = baseHref.substr(0, canonical.length - 1)
                }

                if (req.toView.resource.catalog && !req.query.catalog) {
                    return res.redirect(301, baseHref + "/?catalog=" + req.toView.resource.catalog.id)
                }

                return res.render('./dist/browser/' + filename + '.html', {
                    req: req,
                    res: res
                });


                break;

            case 'map':

                // return res.json(req.toView)

                return res.render('./dist/browser/warto-zobaczyc.html', {
                    req: req,
                    res: res
                });

                break
            case 'attachments':

                // return res.json(req.toView)

                return res.render('./views/resources/attachments', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    attachments: req.toView.resource.attachments,
                    currentCatalog: req.toView.resource.currentCatalog,
                    partners: req.partners,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break;

            case 'form_question':
                return res.render('./views/resources/form-question', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    partners: req.partners,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })
                break;

            case 'invoice':
                return res.render('./views/resources/form-invoice', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    partners: req.partners,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })
                break;

            case 'insurance':
                return res.render('./views/resources/form-insurance', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    partners: req.partners,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })
                break;

            case 'catalogs_presentation':

                // return res.json(req.toView)

                return res.render('./views/resources/catalogs-presentation.pug', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    partners: req.partners,
                    currentCatalog: req.toView.resource.currentCatalog,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    catalogs: req.toView.resource.catalogs,
                    link: req.toView.data.link
                })

                break;

            case 'distribution_page':

                // return res.json(req.toView)

                return res.render('./views/resources/distribution-page.pug', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    links: req.toView.resource.childsLinks,
                    partners: req.partners,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })


                break;



            case 'institutions_list':

                // return res.json(req.toView)

                return res.render('./views/resources/institutions-list.pug', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    partners: req.partners,
                    currentCatalog: req.toView.resource.currentCatalog,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    link: req.toView.data.link,
                    isCookie: req.isCookie,
                    institutions: req.toView.resource.institutions
                })

                break;


            case 'recomendations_files':

                // return res.json(req.toView)

                return res.render('./views/resources/recomendations-files.pug', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    partners: req.partners,
                    currentCatalog: req.toView.resource.currentCatalog,
                    domain,
                    moment,
                    widgets: req.widgetsGroup,
                    link: req.toView.data.link,
                    isCookie: req.isCookie,
                    recomendations: req.toView.resource.recomendations
                })

                break

            case 'sezon':

                return res.render('./views/resources/sezon', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    domain,
                    partners: req.partners,
                    link: req.toView.data.link,
                    events: req.toView.resource.events.hits.hits,
                    moment,
                    widgets: req.widgetsGroup,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break

            case 'content':

                return res.render('./views/resources/content.pug', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    currentCatalog: req.toView.resource.currentCatalog,
                    url,
                    domain,
                    widgets: req.widgetsGroup,
                    partners: req.partners,
                    isCookie: req.isCookie,
                    link: req.toView.data.link
                })

                break

            case 'contact':

                return this.showCustomView(req, res, canonical, menus, url, domain, req.partners)

                break

            case 'custom':

                return this.showCustomView(req, res, canonical, menus, url, domain, req.partners)

                break

            default:
                return res.status(404)
                    .render('./views/404.pug', {
                        menus,
                        widgets: req.widgetsGroup,
                        currentCatalog: req.toView.resource.currentCatalog,
                        isCookie: req.isCookie,
                    });
                break;

        }

    }

    static showCustomView(req, res, canonical, menus, url, domain, partners) {

        // return res.json(req.toView);
        // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
        return res.render('./views/custom/' + req.toView.data.link.customView + '.pug', {
            controller: '/controllers/' + req.toView.data.link.customView + '.controller.js',
            title: '',
            canonical: canonical,
            meta_desc: '',
            meta_keywords: '',
            menus: menus,
            path: req.path,
            currentCatalog: req.toView.resource.currentCatalog,
            url,
            domain,
            partners,
            widgets: req.widgetsGroup,
            isCookie: req.isCookie,
            link: req.toView.data.link
        })
    }

    searchIndexShow(req, res) {
        var canonical = ParseHelper.getCanonical(req.path);
        var url = req.protocol + '://' + req.hostname + req.path;
        var domain = req.protocol + '://' + req.hostname;
        return res.render('browser/index', {
            req: req,
            res: res,
            title: '',
            canonical: canonical,
            meta_desc: '',
            meta_keywords: '',
            menus: req.menus,
            path: req.path,
            widgets: req.widgetsGroup,
            isCookie: req.isCookie,
            url,
            domain
        });
    }

}


module.exports = new PageController()