const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Promo = sequelize.define('promo', {
    title: DataTypes.STRING,
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
    attachFile: {
        type: DataTypes.STRING,
        length: 255
    },
    description: DataTypes.TEXT,
    linkTo: DataTypes.STRING,
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ordering: DataTypes.INTEGER
}, {});

module.exports = Promo