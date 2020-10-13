const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Slide = sequelize.define('slide', {
    image: DataTypes.STRING,
    link: DataTypes.STRING,
    title: DataTypes.STRING,
    subTitle: DataTypes.STRING,
    linkTitle: DataTypes.STRING,
    ordering: DataTypes.TINYINT,
    target: {
        type: DataTypes.ENUM,
        values: ['_blank', '_self'],
        defaultValue: '_self'
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    }
});

module.exports = Slide