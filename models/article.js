const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Article = sequelize.define('article', {
  title: DataTypes.STRING(255),
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  image: DataTypes.STRING,
  microGallery: {
    type: DataTypes.TEXT,
    get() {

      if (this.getDataValue('microGallery')) {
        return JSON.parse(this.getDataValue('microGallery'));
      } else {
        return null
      }
    },
    set(val) {
      this.setDataValue('microGallery', JSON.stringify(val))
    }
  },
  smallDesc: DataTypes.TEXT,
  longDesc: DataTypes.TEXT,
  onHome: { type: DataTypes.BOOLEAN, defaultValue: false },
  ordering: DataTypes.INTEGER,
  params: {
    type: DataTypes.TEXT,
    get() {

      if (this.getDataValue('params')) {
        return JSON.parse(this.getDataValue('params'));
      } else {
        return null
      }
    },
    set(val) {
      this.setDataValue('params', JSON.stringify(val))
    }
  },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
  metaDescription: DataTypes.TEXT,
  metaKeywords: DataTypes.TEXT,
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  }
}, {});

module.exports = Article