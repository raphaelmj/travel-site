const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Day = sequelize.define('day', {
    daysNumber: DataTypes.MEDIUMINT
}, {});

module.exports = Day