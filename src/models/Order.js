const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const sequelize = new Sequelize('mssql');
class Order extends Model {}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    macp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ngayDat: {
        type: DataTypes.DATETIME,
        defaultValue: DataTypes.NOW
    },
    loaiGD: {
        type: DataTypes.STRING,
        allowNull: false
    },
    soLuong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gia: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: false
    },
    trangThaiLenh: {
        type: DataTypes.STRING,
        defaultValue: 'CHO_KHOP'
    },
}, {
    sequelize, // We need to pass the connection instance
    modelName: 'Order' // We need to choose the model name
});

// the defined model is the class itself
console.log(Order === sequelize.models.Order); // true