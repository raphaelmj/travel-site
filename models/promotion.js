const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Promotion = sequelize.define('promotion', {
    title: DataTypes.STRING,
    linkTo: DataTypes.STRING,
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
    description: DataTypes.TEXT,
    ordering: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {});

module.exports = Promotion