const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Institution = sequelize.define('institution', {
    name: DataTypes.STRING,
    logo: {
        type: DataTypes.STRING,
        length: 255
    },
    tourTarget: {
        type: DataTypes.STRING,
        length: 1000
    },
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ordering: DataTypes.INTEGER
}, {});

module.exports = Institution