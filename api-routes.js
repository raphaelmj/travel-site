const router = require('express').Router();

const LinksController = require("./controllers/api/LinksController")
const MenuController = require("./controllers/api/MenuController")
const SearchController = require("./controllers/SearchController")
const CatalogController = require('./controllers/api/CatalogController')
const CategoryController = require('./controllers/api/CategoryController')
const ArticleController = require('./controllers/api/ArticleController')
const EventController = require('./controllers/api/EventController')
const MediaRepository = require('./repositories/MediaRepository')
const UploadController = require('./controllers/api/UploadController')
const SlidesController = require('./controllers/api/SlidesController')
const PromosController = require('./controllers/api/PromoController')
const HomePageController = require('./controllers/api/HomePageController')
const PartnerController = require('./controllers/api/PartnerController')
const InstitutionController = require('./controllers/api/InstitutionController')
const RecommendationController = require('./controllers/api/RecommendationController')
const AttachmentController = require('./controllers/api/AttachmentController')
const FiltersCriteriaController = require('./controllers/api/FiltersCriteriaController')
const UpdateFilesController = require('./controllers/api/UpdateFilesController')
const WidgetController = require('./controllers/api/WidgetController')


const authmiddleware = require('./middlewares/admin/authmiddleware')


router.get('/search/index', SearchController.index)
router.get('/get/search/criteria', SearchController.getCriteria)
router.get('/get/search/criteria/base', SearchController.getCriteriaBase)
router.get('/cache/search/criteria', SearchController.cacheCriteria)
router.get('/get/point/search', SearchController.searchCriteriaList)
router.get('/get/catalog/:id', CatalogController.getCatalog)
router.get('/get/cached/menu', MenuController.getCachedMenu)
router.get('/get/event/search/number', EventController.findEventByNumber)





router.get('/get/links/full/data', authmiddleware, LinksController.getLinksListFullData)
router.get('/get/links', authmiddleware, LinksController.getLinksList)
router.get('/get/links/tree', authmiddleware, LinksController.getTree)
router.get('/get/menu/:id', authmiddleware, MenuController.getMenu);
router.get('/get/menus/full', authmiddleware, MenuController.getFullMenuListData)
router.get('/get/menus/flat/links', authmiddleware, MenuController.getMenusFlatLinks)
router.get('/get/menu/links/:id', authmiddleware, MenuController.getMenuLinks)
router.get('/get/menus/list', authmiddleware, MenuController.getMenuList);
router.get('/get/link/resource/:id', authmiddleware, LinksController.getLinkResource)
router.get('/get/data/resources', authmiddleware, LinksController.getResourcesData)
router.put('/update/menu/field/:id', authmiddleware, MenuController.updateMenuField)
router.post('/change/link/order', authmiddleware, LinksController.changeLinksOrder)
router.post('/create/new/link', authmiddleware, LinksController.createNewLink)
router.post('/check/is/link/path/free', authmiddleware, LinksController.checkIsPathFree)
router.post('/delete/link/recfactor', authmiddleware, LinksController.removeLinkRefactor)
router.post('/update/link/refactor/menus', authmiddleware, LinksController.updateLinkData, LinksController.updateMenusAfterLinkChange)
router.post('/change/link/type', authmiddleware, LinksController.linkUpdateType, LinksController.updateMenusAfterLinkChangeType)
router.post('/add/link/to/menu', authmiddleware, MenuController.addLinkToMenu)
router.delete('/remove/link/:id', authmiddleware, MenuController.linkRemoveFromJson, MenuController.removeLinkFromBase)
router.post('/menu/remove/link', authmiddleware, MenuController.removeLinkFromMenu)
router.post('/menu/requre/cache/:id', authmiddleware, MenuController.cacheMenu)
router.get('/menu/prepare/from/tree/:id', authmiddleware, MenuController.prepareFromTree)



router.get('/get/geo/filters', FiltersCriteriaController.getGeoFiltersCriteria)
router.get('/get/regions', FiltersCriteriaController.getRegions)
router.get('/get/cities', FiltersCriteriaController.getCities)
router.get('/get/region/:id/cities', FiltersCriteriaController.getRegionCities)
router.get('/get/region/:id/attractions', FiltersCriteriaController.getRegionAttractions)

router.post('/create/region', authmiddleware, FiltersCriteriaController.createRegion)
router.post('/update/region', authmiddleware, FiltersCriteriaController.updateRegion)

router.post('/update/filter/city/refactor/index', authmiddleware, FiltersCriteriaController.updateFilterCity)
router.post('/create/filter/city', authmiddleware, FiltersCriteriaController.createFilterCity)
router.delete('/delete/filter/city/refactor/index/:id', authmiddleware, FiltersCriteriaController.deleteFilterCity)


router.post('/update/filter/attraction/refactor/index', authmiddleware, FiltersCriteriaController.updateFilterAttraction)
router.post('/create/filter/attraction', authmiddleware, FiltersCriteriaController.createFilterAttraction)
router.delete('/delete/filter/attraction/refactor/index/:id', authmiddleware, FiltersCriteriaController.deleteFilterAttraction)



router.get('/get/days', authmiddleware, FiltersCriteriaController.getDays)
router.get('/get/ages', authmiddleware, FiltersCriteriaController.getAges)
router.get('/get/themes', authmiddleware, FiltersCriteriaController.getThemes)


router.post('/create/day', authmiddleware, FiltersCriteriaController.createDay)
router.post('/update/day', authmiddleware, FiltersCriteriaController.updateDay)
router.delete('/delete/day/:id', authmiddleware, FiltersCriteriaController.deleteDay)

router.post('/create/age', authmiddleware, FiltersCriteriaController.createAge)
router.post('/update/age', authmiddleware, FiltersCriteriaController.updateAge)
router.delete('/delete/age/:id', authmiddleware, FiltersCriteriaController.deleteAge)


router.post('/create/theme', authmiddleware, FiltersCriteriaController.createTheme)
router.post('/update/theme', authmiddleware, FiltersCriteriaController.updateTheme)
router.delete('/delete/theme/:id', authmiddleware, FiltersCriteriaController.deleteTheme)


router.get('/get/catalogs', CatalogController.getCatalogs)
router.post('/update/catalog', authmiddleware, MediaRepository.uploadImageCatalogGetSizeIfExists, CatalogController.update)
router.post('/create/catalog', authmiddleware, MediaRepository.uploadImageCatalogGetSizeIfExists, CatalogController.create)
router.post('/change/catalogs/order', authmiddleware, CatalogController.changeOrder)
router.delete('/delete/catalog/:id', authmiddleware, CatalogController.delete)
router.post('/get/catalog/events/query', authmiddleware, EventController.getEventsByQuery)

router.get('/get/tax', (req, res) => {
    var tax = require('./config/tax')
    return res.json(tax)
})

var uploadSingle = MediaRepository.prepareFileSimpleUpload()
router.post('/upload/one/file', authmiddleware, uploadSingle.single('file'), UploadController.uploadSimpleFileEnd)


var uploadSingleWithName = MediaRepository.prepareFileSimpleUploadWithName()
router.post('/upload/one/file/name', authmiddleware, uploadSingleWithName.single('file'), UploadController.uploadSimpleFileEndWithName)

var uploadGallery = MediaRepository.prepareImageStorageUpload();
router.post('/upload/gallery/images', authmiddleware, MediaRepository.beforePrepareDataToGallery, uploadGallery.array('file'), MediaRepository.afterUplaodGallery)

router.get('/get/event/:id', EventController.getFullEvent)
router.post('/update/event/:id', authmiddleware, EventController.updateField)
router.post('/full/update/event', authmiddleware, EventController.fullUpdateEvent)
router.post('/create/event', authmiddleware, EventController.createEvent)
router.post('/event/number/free/check', authmiddleware, EventController.checkIsNumberFree)
router.get('/widgets/group', WidgetController.getWidgetsGroup)

/*

var upload = MediaRepository.prepareImageStorageUpload();
router.post('/upload/gallery/images', MediaRepository.beforePrepareDataToGallery, upload.array('file'), MediaRepository.afterUplaodGallery)


*/




router.get('/get/category/:id', CategoryController.getCategoryById)
router.get('/get/categories', CategoryController.getCategories)
router.post('/get/limit/articles', ArticleController.getLimitArticles)
router.post('/change/article/status', authmiddleware, ArticleController.changeStatus)

var uploadGalleryArt = MediaRepository.prepareImageStorageUpload();
router.post('/upload/art/gallery/images', authmiddleware, MediaRepository.beforePrepareDataToGalleryArt, uploadGalleryArt.array('file'), MediaRepository.afterUplaodGallery)
router.post('/update/article/data', authmiddleware, MediaRepository.uploadImageIfExists, ArticleController.updateArticle)
router.post('/create/article', authmiddleware, MediaRepository.uploadImageIfExists, ArticleController.createArticle)
router.delete('/delete/article/:id', authmiddleware, ArticleController.deleteArticle)



router.get('/get/slides', authmiddleware, SlidesController.getSlides)
router.post('/update/slide', authmiddleware, MediaRepository.uploadImageIfExists, SlidesController.updateSlide)
router.post('/create/slide', authmiddleware, MediaRepository.uploadImageIfExists, SlidesController.createSlide)
router.post('/change/slides/order', authmiddleware, SlidesController.changeSlidesOrder)
router.post('/change/slide/status', authmiddleware, SlidesController.changeStatus)
router.delete('/delete/slide/:id', authmiddleware, SlidesController.deleteSlide)


router.get('/get/promos', authmiddleware, PromosController.getPromos)
router.post('/update/promo', authmiddleware, MediaRepository.uploadImageGetSizeIfExists, PromosController.update)
router.post('/create/promo', authmiddleware, MediaRepository.uploadImageGetSizeIfExists, PromosController.create)
router.post('/change/promos/order', authmiddleware, PromosController.changeOrder)
router.post('/change/promo/status', authmiddleware, PromosController.changeStatus)
router.delete('/delete/promo/:id', authmiddleware, PromosController.delete)

router.get('/get/institutions', authmiddleware, InstitutionController.getInstitutions)
router.post('/update/institution', authmiddleware, MediaRepository.uploadImageIfExists, InstitutionController.update)
router.post('/create/institution', authmiddleware, MediaRepository.uploadImageIfExists, InstitutionController.create)
router.post('/change/institutions/order', authmiddleware, InstitutionController.changeOrder)
router.post('/change/institution/status', authmiddleware, InstitutionController.changeStatus)
router.delete('/delete/institution/:id', authmiddleware, InstitutionController.delete)


router.get('/get/recos', authmiddleware, RecommendationController.getRec)
router.post('/update/reco', authmiddleware, MediaRepository.uploadImageGetSizeIfExists, RecommendationController.update)
router.post('/create/reco', authmiddleware, MediaRepository.uploadImageGetSizeIfExists, RecommendationController.create)
router.post('/change/recos/order', authmiddleware, RecommendationController.changeOrder)
router.post('/change/reco/status', authmiddleware, RecommendationController.changeStatus)
router.delete('/delete/reco/:id', authmiddleware, RecommendationController.delete)


router.get('/get/hps', authmiddleware, HomePageController.getHomePages)
router.post('/update/hp', authmiddleware, MediaRepository.uploadImageIfExists, HomePageController.update)
router.post('/create/hp', authmiddleware, MediaRepository.uploadImageIfExists, HomePageController.create)
router.post('/change/hps/order', authmiddleware, HomePageController.changeOrder)
// router.post('/change/hp/status', HomePageController.changeStatus)
router.delete('/delete/hp/:id', authmiddleware, HomePageController.delete)


router.get('/get/partners', authmiddleware, PartnerController.getPartners)
router.post('/update/partner', authmiddleware, MediaRepository.uploadImageIfExists, PartnerController.update)
router.post('/create/partner', authmiddleware, MediaRepository.uploadImageIfExists, PartnerController.create)
router.post('/change/partners/order', authmiddleware, PartnerController.changeOrder)
router.delete('/delete/partner/:id', authmiddleware, PartnerController.delete)


router.get('/get/attachments', authmiddleware, AttachmentController.getAttachments)
router.post('/update/attachment', authmiddleware, AttachmentController.update)
router.post('/create/attachment', authmiddleware, AttachmentController.create)
router.post('/change/attachments/order', authmiddleware, AttachmentController.changeOrder)
router.post('/change/attachment/status', authmiddleware, AttachmentController.changeStatus)
router.delete('/delete/attachment/:id', authmiddleware, AttachmentController.delete)





var uploadZip = MediaRepository.prepareZipStorageUpload();
router.post('/upload/update/zip', authmiddleware, uploadZip.array('file'), UpdateFilesController.zipFileAfterUpload)
router.get('/get/folders/events/list', authmiddleware, UpdateFilesController.getEventUplaodFolders)
router.post('/remove/folder/events', authmiddleware, UpdateFilesController.removeEventsDir)
router.post('/folder/update/events', authmiddleware, UpdateFilesController.updateFolderEvents)


router.get('/get/widgets', authmiddleware, WidgetController.getWidgets)
router.get('/get/widgets/group', authmiddleware, WidgetController.getWidgetsGroup)
router.post('/update/widget', authmiddleware, WidgetController.updateWidget)
router.post('/update/widget/cert', authmiddleware, MediaRepository.uploadImageGetSizeIfExists, WidgetController.updateWidgetCert)


router.get('/get/links/content', authmiddleware, LinksController.getLinksContent)
router.post('/update/link/content', authmiddleware, LinksController.updateLinkContent)


// router.post('/get/limit/contents', ContentController.getLimitContents)
// router.post('/update/content/data', MediaRepository.uploadImageIfExists, ContentController.updateContent)
// router.post('/create/content', MediaRepository.uploadImageIfExists, ContentController.createContent)
// router.delete('/delete/content/:id', ContentController.deleteContent)
// router.post('/change/content/status', ContentController.changeStatus)


// router.post('/get/limit/agendas', AgendaController.getLimitAgendas)
// router.post('/update/agenda/data', MediaRepository.uploadImagesAgIfExists, AgendaController.updateAgenda)
// router.post('/create/agenda', MediaRepository.uploadImagesAgIfExists, AgendaController.createAgenda)
// router.post('/change/agenda/status', AgendaController.changeStatus)
// router.delete('/delete/agenda/:id', AgendaController.deleteAgenda)

// router.get('/get/slides', SlidesController.getSlides)
// router.post('/slide/status/change', SlidesRepository.statusChange, SlidesController.getSlides)
// router.post('/slides/order/change', SlidesRepository.slidesOrderChange, SlidesController.getSlides)
// router.post('/create/slide', MediaRepository.uploadImageIfExists, SlidesController.createNewSlide);
// router.post('/update/slide', MediaRepository.uploadImageIfExists, SlidesController.updateSlide);
// router.delete('/delete/slide/:id', SlidesController.deleteSlide);


// router.get('/get/content/galleries/:id', GalleryController.getContentGalleries)
// router.get('/get/galleries', GalleryController.getGalleries)
// router.get('/get/galleries/by/phrase', GalleryController.getGalleriesByPhrase)
// router.get('/get/free/galleries', GalleryController.getFreeGalleries)
// var upload = MediaRepository.prepareImageStorageUpload();
// router.post('/upload/gallery/images', MediaRepository.beforePrepareDataToGallery, upload.array('file'), MediaRepository.afterUplaodGallery)
// router.post('/create/gallery', GalleryController.createGallery)
// router.post('/update/gallery', GalleryController.updateGallery)
// router.post('/set/gallery/to/content', GalleryController.setGalleryToContent)
// router.delete('/deatch/gallery/:id', GalleryController.detachGallery)
// router.get('/get/gallery/:id', GalleryController.getGallery)
// router.post('/change/gallery/status', GalleryController.changeStatus)
// router.delete('/delete/gallery/:id', GalleryController.deleteGallery)


// router.get('/get/resources/pack', ResourcesPackController.getResourcesPack)
// router.get('/get/home/resources/first', HomePageController.getHomePageResourceFirst)
// router.post('/update/first/homepage', HomePageController.updateFirstHomoPage)

// var uploadSimple = MediaRepository.prepareImageStorageSimpleUpload();
// router.post('/upload/simple/images/:folder', MediaRepository.beforePrepareDataToFolder, uploadSimple.array('file'), MediaRepository.afterUplaodFolder);

// router.get('/get/files/from/:folder', MediaRepository.getFolderFiles)
// router.post('/remove/file', MediaRepository.removeFile)

// router.post('/check/is/alias/free', ValidateRepository.checkIsAliasFree)
// router.post('/check/except/is/alias/free', ValidateRepository.checkIsAliasFreeExcept)



// router.post('/send/email', EmailController);


module.exports = router;