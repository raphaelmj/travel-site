const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const City = sequelize.define('city', {
  name: DataTypes.STRING,
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT
}, {});

module.exports = City