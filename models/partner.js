const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Partner = sequelize.define('partner', {
    link: DataTypes.STRING,
    image: DataTypes.STRING,
    ordering: {
        type: DataTypes.INTEGER
    }
}, {});

module.exports = Partner