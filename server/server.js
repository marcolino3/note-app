// Libraries laden
const _= require('lodash');
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Lokale Dateien laden
var {mongoose} = require('./../src/backend/db/mongoose');
var {Note} = require('./../src/backend/models/Note');
var noteController = require('./note-controller');
var routes = require('./routes');


// Express app erstellen
var app = express();

// Middleware Body Parser wandelt in JSON um
app.use(bodyParser.json());

// Middleware Public Directory
app.use(express.static(__dirname + './../src/frontend'));

// Note Controller laden
noteController(app);

// Routes laden
routes(app);

// Server listen
app.listen(3000, () => {
    console.log('Started on port 3000');
});

