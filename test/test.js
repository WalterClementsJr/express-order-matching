const sequelize = require("../src/configs/sequelize.config");
const Order = require('../src/models/Order');

// Order.findAll()
//     .then(orders => console.table(JSON.stringify(orders)))
//     .catch(err => console.log("error" + err)
//     );

let order = Order.build(
    {
        macp: "ACA",
        loaiGD: "M",
        giaDat: 2000,
        soLuong: 200,
    }
);

order.save().then(function(item){
    console.log("INSERT OK");
    console.log(order.toJSON());
}).catch(function (err) {
    // handle error;
    console.log('test error');
    console.log(err);
});

