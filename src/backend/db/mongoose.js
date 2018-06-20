//Mongoose laden
const mongoose = require('mongoose');

// Promises in Mongoose einbinden
mongoose.Promise = global.Promise;

// mit Datenbank verbinden
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};