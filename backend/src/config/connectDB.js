const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('mysql://root:XRPTkbRnlBclKYmVwZMiFuDmbyOquaMX@monorail.proxy.rlwy.net:29288/railway', {
    dialect: 'mysql',
    timezone: "+07:00",
});
(checkConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()
module.exports = sequelize;
