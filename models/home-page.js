const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const HomePage = sequelize.define('homepage', {
    title: DataTypes.STRING,
    selfLink: DataTypes.STRING,
    image: DataTypes.STRING,
    color: {
        type: DataTypes.ENUM,
        values: ['C92127', 'F58220', 'e8c31c', '24266e', '008c45'],
        defaultValue: 'e8c31c'
    },
    target: {
        type: DataTypes.ENUM,
        values: ['_blank', '_self'],
        defaultValue: '_self'
    },
    ordering: DataTypes.MEDIUMINT
}, {});

module.exports = HomePage