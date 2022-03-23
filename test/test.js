const sequelize = require("../src/configs/sequelize.config");
const TEDIOUS_CONFIG = require("../src/configs/tedious.config");
const Connection = require('tedious').Connection;


// let connection = new Connection(TEDIOUS_CONFIG);
// connection.on('connect', function(err) {
//     if(err) {
//         console.log('Error: ', err)
//     }
//     console.log("CONNECTED TO DB");
// });

sequelize
    .authenticate()
    .then(() => {
        console.log('SQLize Connection has been established successfully.');
    })
    .catch(err => {
        console.error('SQLize Unable to connect to the database:', err);
    });
