const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')

const Doc = sequelize.define('doc', {
    number: DataTypes.STRING,
    type: {
        type: DataTypes.ENUM,
        values: ['insurance', 'invoice']
    },
    noticeInfo: {
        type: DataTypes.TEXT,
        get() {
            return JSON.parse(this.getDataValue('noticeInfo'))
        }
    },
    docInfo: {
        type: DataTypes.TEXT,
        get() {
            return JSON.parse(this.getDataValue('docInfo'))
        }
    },
    suffix: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    tokenData: DataTypes.STRING(500),
    tokenUrl: DataTypes.STRING(500),
    uploadAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
}, {});

module.exports = Doc