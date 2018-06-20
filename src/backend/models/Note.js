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
    }
    // dueDate: {
    //     type: Number,
    //     required: true,
    //     minlength: 1,
    // },
    // completed: {
    //     type: Boolean,
    //     default: false
    // },
    // completedAt: {
    //     type: Number,
    //     default: null
    // },
    // createdAt: {
    //     type: Number,
    //     default: null
    // },
    // editedAt: {
    //     type: Number,
    //     default: null
    // }
});

module.exports = {Note};