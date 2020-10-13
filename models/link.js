const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Link = sequelize.define('link', {
  title: DataTypes.STRING,
  alias: DataTypes.STRING,
  path: DataTypes.STRING,
  dataType: {
    type: DataTypes.ENUM,
    values: ['home', 'article', 'articles', 'gallery', 'galleries', 'events', 'event', 'catalog', 'map', 'category', 'contact', 'custom', 'attachments', 'form_question', 'invoice', 'insurance', 'catalogs_presentation', 'institutions_list', 'recomendations_files', 'distribution_page', 'content', 'sezon']
  },
  eventsType: {
    type: DataTypes.ENUM,
    values: ['winter', 'summer', 'any'],
    defaultValue: 'any'
  },
  externalLink: DataTypes.STRING,
  customView: DataTypes.STRING,
  linkedMenus: {
    type: DataTypes.TEXT
  },
  content: {
    type: DataTypes.TEXT
  },
  imageIcon: DataTypes.INTEGER,
  metaTitle: DataTypes.STRING,
  metaDesc: DataTypes.STRING,
  metaKeywords: DataTypes.STRING,
  ordering: DataTypes.INTEGER,
  params: DataTypes.TEXT,
  status: DataTypes.SMALLINT
}, {});


module.exports = Link