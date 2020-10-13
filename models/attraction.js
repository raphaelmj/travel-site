const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Attraction = sequelize.define('attraction', {
  name: DataTypes.STRING(255),
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  image: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
  attractionType: {
    type: DataTypes.ENUM,
    values: ['any', 'park', 'muzeum', 'monument', 'sacral', 'nature', 'aqua', 'sport', 'education', 'culture'],
    defaultValue: 'any'
  }
}, {});

module.exports = Attraction