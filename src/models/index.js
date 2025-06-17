const sequelize = require('../config/database');
const Reservation = require('./Reservation');
const User = require('./User');

//Define associations
Reservation.belongsTo(User, {foreignKey: 'userId', as: 'user'});
User.hasMany(Reservation, {foreignKey: 'userId', as : 'reservations '});


module.exports = {
    sequelize,
    Reservation,
    User
};