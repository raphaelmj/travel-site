const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Theme = sequelize.define('theme', {
    name: DataTypes.STRING
}, {});

module.exports = Theme