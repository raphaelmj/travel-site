const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Recomendation = sequelize.define('recomendation', {
    name: DataTypes.STRING,
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
    file: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ordering: DataTypes.INTEGER
}, {});

module.exports = Recomendation