const sequelize = require("../src/configs/sequelize.config");
const TEDIOUS_CONFIG = require("../src/configs/tedious.config");
const Connection = require('tedious').Connection;
const Order = require('../src/models/Order');


// let connection = new Connection(TEDIOUS_CONFIG);
// connection.on('connect', function(err) {
//     if(err) {
//         console.log('Error: ', err)
//     }
//     console.log("CONNECTED TO DB");
// });

Order.findAll()
    .then(orders => console.log(JSON.stringify(orders)))
    .catch(err => console.log("error" + err)
    );

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('SQLize Connection has been established successfully.');
//
//     })
//     .catch(err => {
//         console.error('SQLize Unable to connect to the database:', err);
//     });
