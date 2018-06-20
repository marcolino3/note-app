// Libraries laden
const _= require('lodash');
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Lokale Dateien laden
var {mongoose} = require('./../src/backend/db/mongoose');
var {Note} = require('./../src/backend/models/Note');

// Express app erstellen
var app = express();
const port = process.env.PORT || 3000;

// Middleware Body Parser wandelt in JSON um
app.use(bodyParser.json());

// Middleware Public Directory
app.use(express.static(__dirname + './../src/frontend'));

// Routes
app.get("/", function(req, res){
    res.sendFile("index.html",  {root: __dirname + '/frontend/'});
});

// Post API
app.post('/notes', (req, res) => {
    var note = new Note({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        createdAt: req.body.createdAt,
        editedAt: req.body.editedAt
    });

    // in DB abspeichern
    note.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// Get API
app.get('/notes', (req, res) => {
    Note.find().then((notes) => {
        res.send({notes});
    }, (err) => {
        res.status(400).send(err);
    });
});

// Get /notes/12345
app.get('/notes/:id',(req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); // 404 - send back empty send
    }    

    // findById
    Note.findById(id).then((note)=> {
        if (!note) {
            return res.status(404).send();  // if no note - send back 404 with empty body
        }
        // sucess
        res.send({note});   // if note - send it back

    }).catch((err) => { // error
        res.status(400).send(); // 400 - and send empty body back
    });

});

// Delete /notes/123
app.delete('/notes/:id', (req, res) => {

    // get Id
    var id = req.params.id;

    // validate the id > not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove note by id
    Note.findByIdAndRemove(id).then((note) => {
        if (!note) {
            res.status(404).send(); // if no doc, send 404
        }

        // success
        res.send({note}); // if doc, send doc back with 200

    }).catch((err) => {     // error
        res.status(400).send(); // 400 with empty body
    });   
            
});

// Patch (Update)
app.patch('/notes/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['title', 'description', 'dueDate', 'completed']); // restrict properties to be changed

    // validate ID
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Toggle completed
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Update Document
    Note.findByIdAndUpdate(id, {$set: body}, {new: true}).then((note) => {
        if (!note) {
            return res.status(404).send();
        }

        // success
        res.send({note});

    }).catch((err) => { // error
        res.status(400).send();
    });
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

