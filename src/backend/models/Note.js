// Mongoose laden
let mongoose = require('mongoose');

// Model erstellen
let Note = mongoose.model('Note', {
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    priority: {
        type: Number,
        required: true,
        minlength: 1,
    },
    dueDate: {
        type: Date,
        required: true,
        minlength: 1,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: null
    },
    editedAt: {
        type: Date,
        default: null
    }
});

module.exports = {Note};