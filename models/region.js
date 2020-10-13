const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Region = sequelize.define('region', {
  name: DataTypes.STRING,
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  cords: DataTypes.TEXT('long'),
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT
}, {});

module.exports = Region