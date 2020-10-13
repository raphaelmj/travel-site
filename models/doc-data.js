const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Docdata = sequelize.define('docdata', {
    data: DataTypes.BLOB('long')
}, {});

module.exports = Docdata