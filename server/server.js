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

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/../dist/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/bundle.js',function(req,res){
    res.sendFile(path.join(__dirname+'/../dist/bundle.js'));
    //__dirname : It will resolve to your project folder.
});


// Post Route
app.post('/todos', (req, res) => {
    var todo = new Note({
        text: req.body.text
    });

    // in DB abspeichern
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// Get Route API
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// Get /todos/12345
app.get('/todos/:id',(req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); // 404 - send back empty send
    }    

    // findById
    Todo.findById(id).then((todo)=> {
        if (!todo) {
            return res.status(404).send();  // if no todo - send back 404 with empty body
        }
        // sucess
        res.send({todo});   // if todo - send it back

    }).catch((err) => { // error
        res.status(400).send(); // 400 - and send empty body back
    });

});

// Delete /todos/123
app.delete('/todos/:id', (req, res) => {

    // get Id
    var id = req.params.id;

    // validate the id > not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            res.status(404).send(); // if no doc, send 404
        }

        // success
        res.send({todo}); // if doc, send doc back with 200

    }).catch((err) => {     // error
        res.status(400).send(); // 400 with empty body
    });   
            
});

// Patch (Update)
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); // restrict properties to be changed

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
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        // success
        res.send({todo});

    }).catch((err) => { // error
        res.status(400).send();
    });
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

