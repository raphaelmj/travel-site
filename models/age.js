const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Age = sequelize.define('age', {
  from: DataTypes.MEDIUMINT,
  to: DataTypes.MEDIUMINT
}, {});

module.exports = Age