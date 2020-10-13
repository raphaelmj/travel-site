const router = require('express').Router();
const RouteParseRepository = require('./repositories/RouteParseRepository');
const HomeController = require('./controllers/HomeController');
const PageController = require('./controllers/PageController');
router.get('/admin', (req, res) => {
  return res.render('./views/ngadmin.pug')
})
// router.get('/admin', (req, res) => {
//   return res.render('./static/ngadmin/index.html')
// })
router.get('/', RouteParseRepository.homeParseData, RouteParseRepository.getCacheMenus, HomeController.index)
router.get('/:a/:b?/:c?', RouteParseRepository.getCacheMenus, RouteParseRepository.getCustomData, RouteParseRepository.parseUrl, RouteParseRepository.getResourcesFullData, PageController.indexPage)

module.exports = router;