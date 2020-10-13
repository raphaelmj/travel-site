const cache = require('../config/cache');

class HomeController {

    index(req, res) {

        // return res.json(req.toView)
        req.isCookie = Boolean(req.cookies.rConfirm)
        // console.log(req.isCookie)

        return res.render('./views/home-page.pug', {
            title: '',
            menus: req.menus,
            slides: req.toView.slides,
            boxes: req.toView.boxes,
            homeArticle: req.toView.homeArticle,
            currentCatalog: req.toView.currentCatalog,
            partners: req.toView.partners,
            promos: req.toView.promos,
            articles: req.toView.articles,
            widgets: req.toView.widgetsGroup,
            meta_desc: '',
            link: req.toView.link,
            isCookie: req.isCookie,
            controller: '/controllers/home.controller.js'
        })


    }

}


module.exports = new HomeController()