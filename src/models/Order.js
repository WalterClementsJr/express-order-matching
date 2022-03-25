const sequelize = require("../configs/sequelize.config");
const { DataTypes, Model } = require('sequelize');

class Order extends Model {}

Order.init({
    orderId: {
        field: 'ld_id',
        type: DataTypes.INTEGER,
        allowNull: true
    },
    macp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderDate: {
        field: 'ngayDat',
        type: DataTypes.DATE
    },
    loaiGD: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loaiLenh: {
        type: DataTypes.STRING
    },
    soLuong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    giaDat: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: false
    },
    trangThaiLenh: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'LENHDAT',
    createdAt: false,
    updatedAt: false
});
Order.removeAttribute('id');

module.exports = Order;
