const sequelize = require('../config/sequelize')
const User = require('./user')
const Link = require('./link')
const Menu = require('./menu')
const Region = require('./region')
const City = require('./city');
const Attraction = require('./attraction')
const Article = require('./article')
const Gallery = require('./gallery')
const Category = require('./category')
const Age = require('./age')
const Day = require('./day')
const Theme = require('./theme')
const Slide = require('./slide')
const Event = require('./event')
const Catalog = require('./catalog')
const HomePage = require('./home-page')
const EventArchive = require('./event_archive')
const Partner = require('./partner')
const Doc = require('./doc')
const Docdata = require('./doc-data')
const Institution = require('./institution')
const Attachment = require('./attachment')
const Recomendation = require('./recomendation')
const Promo = require('./promo')
const Promotion = require('./promotion')
const Widget = require('./widget')


Link.belongsTo(Link)
Link.hasMany(Link)

Link.belongsToMany(Menu, {
    as: 'Menus',
    through: 'link_menu',
    foreignKey: 'linkId'
})


Menu.belongsToMany(Link, {
    as: 'Links',
    through: 'link_menu',
    foreignKey: 'menuId'
})

Category.hasMany(Link)
Link.belongsTo(Category, {
    foreignKey: 'categoryId',
    constraints: false,
    as: 'category'
})

Catalog.hasMany(Link)
Link.belongsTo(Catalog)

Gallery.hasMany(Link)
Link.belongsTo(Gallery)

Event.hasMany(Link)
Link.belongsTo(Event)

Article.hasMany(Link)
Link.belongsTo(Article)

Catalog.hasMany(Event)
Event.belongsTo(Catalog)

Category.hasMany(Article)
Article.belongsTo(Category)

Region.hasMany(City)
City.belongsTo(Region)

City.hasMany(Attraction)
Attraction.belongsTo(City)

Attraction.belongsTo(Region)
Region.hasMany(Attraction)

Event.hasOne(Gallery)
Gallery.belongsTo(Event)

Article.hasOne(Gallery)
Gallery.belongsTo(Article);

Attraction.hasOne(Gallery)
Gallery.belongsTo(Attraction);

Doc.hasOne(Docdata)
Docdata.belongsTo(Doc)

Event.belongsToMany(Day, {
    as: 'Days',
    through: 'day_event',
    foreignKey: 'eventId'
})

Day.belongsToMany(Event, {
    as: 'Events',
    through: 'day_event',
    foreignKey: 'dayId'
})

Event.belongsToMany(Age, {
    as: 'Ages',
    through: 'age_event',
    foreignKey: 'eventId'
})

Age.belongsToMany(Event, {
    as: 'Events',
    through: 'age_event',
    foreignKey: 'ageId'
})


Event.belongsToMany(Theme, {
    as: 'Themes',
    through: 'theme_event',
    foreignKey: 'eventId'
})

Theme.belongsToMany(Event, {
    as: 'Events',
    through: 'theme_event',
    foreignKey: 'themeId'
})

Event.belongsToMany(Region, {
    as: 'Regions',
    through: 'region_event',
    foreignKey: 'eventId'
})

Region.belongsToMany(Event, {
    as: 'Events',
    through: 'region_event',
    foreignKey: 'regionId'
})


Event.belongsToMany(City, {
    as: 'Cities',
    through: 'city_event',
    foreignKey: 'eventId'
})


City.belongsToMany(Event, {
    as: 'Events',
    through: 'city_event',
    foreignKey: 'cityId'
})


Event.belongsToMany(Attraction, {
    as: 'Attractions',
    through: 'attraction_event',
    foreignKey: 'eventId'
})

Attraction.belongsToMany(Event, {
    as: 'Events',
    through: 'attraction_event',
    foreignKey: 'attractionId'
})


module.exports = {
    User,
    Link,
    Menu,
    Region,
    City,
    Attraction,
    Article,
    Gallery,
    Age,
    Theme,
    Event,
    EventArchive,
    Category,
    Catalog,
    Slide,
    HomePage,
    Day,
    Partner,
    Doc,
    Docdata,
    Institution,
    Recomendation,
    Attachment,
    Promo,
    Promotion,
    Widget
}