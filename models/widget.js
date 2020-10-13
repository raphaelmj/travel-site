const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Widget = sequelize.define('widget', {
    title: DataTypes.STRING,
    targetAlias: DataTypes.STRING,
    dataType: {
        type: DataTypes.ENUM,
        values: ['insurnace', 'invoice', 'map_info', 'cookie', 'contact', 'cert', 'fcontact']
    },
    data: {
        type: DataTypes.TEXT,
        get() {

            if (this.getDataValue('data')) {
                return JSON.parse(this.getDataValue('data'));
            } else {
                return null
            }
        },
        set(val) {
            this.setDataValue('data', JSON.stringify(val))
        }
    },
}, {});


module.exports = Widget