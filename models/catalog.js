const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Catalog = sequelize.define('catalog', {
    name: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    image: {
        type: DataTypes.TEXT,
        get() {

            if (this.getDataValue('image')) {
                return JSON.parse(this.getDataValue('image'));
            } else {
                return null
            }
        },
        set(val) {
            this.setDataValue('image', JSON.stringify(val))
        }
    },
    attachFile: DataTypes.STRING,
    current: {
        type: DataTypes.BOOLEAN(),
        defaultValue: false
    },
    searchList: {
        type: DataTypes.BOOLEAN(),
        defaultValue: false
    },
    ordering: DataTypes.INTEGER

});

module.exports = Catalog