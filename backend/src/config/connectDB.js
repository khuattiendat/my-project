const {Sequelize} = require('sequelize')
require('dotenv').config();
// production
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    timezone: "+07:00",
});
// dev
// const sequelize = new Sequelize('my_project', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     timezone: "+07:00",
// });
const checkConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
checkConnect();
module.exports = sequelize;
