const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const EventArchive = sequelize.define('event_archive', {
    number: {
        type: DataTypes.STRING(50),
        unique: true
    },
    image: DataTypes.STRING,
    name: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    microGallery: DataTypes.TEXT,
    attachments: DataTypes.TEXT,
    priceNetto: DataTypes.DECIMAL(6, 2),
    priceBrutto: DataTypes.DECIMAL(6, 2),
    status: {
        type: DataTypes.ENUM(['avl', 'noavl']),
        defaultValue: 'avl'
    },
    customersLimit: DataTypes.TINYINT,
    startAt: DataTypes.DATEONLY,
    endAt: DataTypes.DATEONLY,
    metaDescription: DataTypes.TEXT,
    metaKeywords: DataTypes.TEXT
}, {});

module.exports = EventArchive