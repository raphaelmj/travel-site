const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Category = sequelize.define('category', {
    name: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    }
});

module.exports = Category