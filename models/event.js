const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Event = sequelize.define('event', {
  number: {
    type: DataTypes.STRING(50),
    unique: true
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '/img/default-event-image.png'
  },
  name: DataTypes.STRING(255),
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  smallDesc: DataTypes.TEXT,
  longDesc: DataTypes.TEXT,
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
  attachments: {
    type: DataTypes.TEXT,
    get() {

      if (this.getDataValue('attachments')) {
        return JSON.parse(this.getDataValue('attachments'));
      } else {
        return null
      }
    },
    set(val) {
      this.setDataValue('attachments', JSON.stringify(val))
    }
  },
  priceNetto: DataTypes.DECIMAL(6, 2),
  priceBrutto: DataTypes.DECIMAL(6, 2),
  tax: DataTypes.DECIMAL(6, 2),
  priceConfig: {
    type: DataTypes.TEXT,
    get() {

      if (this.getDataValue('priceConfig')) {
        return JSON.parse(this.getDataValue('priceConfig'));
      } else {
        return null
      }
    },
    set(val) {
      this.setDataValue('priceConfig', JSON.stringify(val))
    }
  },
  status: {
    type: DataTypes.ENUM(['avl', 'noavl', 'arch']),
    defaultValue: 'avl'
  },
  eventType: {
    type: DataTypes.ENUM(['template', 'organize']),
    defaultValue: 'template'
  },
  eventSezonType: {
    type: DataTypes.ENUM(['winter', 'summer', 'any']),
    defaultValue: 'any'
  },
  atSezon: { type: DataTypes.BOOLEAN, defaultValue: false },
  customersLimit: DataTypes.TINYINT,
  startAt: DataTypes.DATEONLY,
  endAt: DataTypes.DATEONLY,
  metaDescription: DataTypes.TEXT,
  metaKeywords: DataTypes.TEXT
}, {
  // getterMethods: {
  //   priceConfig() {
  //     return JSON.parse(this.priceConfig);
  //   }
  // }
});

module.exports = Event