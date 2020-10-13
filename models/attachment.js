const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Attachment = sequelize.define('attachment', {
    groupName: DataTypes.STRING,
    files: {
        type: DataTypes.TEXT,
        get() {

            if (this.getDataValue('files')) {
                return JSON.parse(this.getDataValue('files'));
            } else {
                return null
            }
        },
        set(val) {
            this.setDataValue('files', JSON.stringify(val))
        }
    },
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ordering: DataTypes.INTEGER
}, {});

module.exports = Attachment