// Save Notes to LocalStorage
const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes));

// Get Notes from LocalStorage
const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes');

    if (notesJSON !== null) {
        return JSON.parse(notesJSON);
    } else {
        return [];
    }
}

// renderUI
const renderUI = function () {
    renderNotes(notes, filters);
    saveNotes(notes);
}

// Increment Priority
const incrementPriority = function (id) {
    const maxPriority = 3;
    notes.filter(function (note) {
        if (note.id === id && note.priority < 3) {
            note.priority++;
        }
    });
}; 

// Decrement Priority
const decrementPriority = function (id) {
    notes.filter(function (note) {
        if (note.id === id && note.priority > 0) {
            note.priority--;
        }
    });
}

// Set Priority Color
const setPriorityColor = function (id) {
}

// Set Completed
const setCompleted = function (id) {
    notes.filter(function (note) {
        if (note.id === id) {
            note.completed = !note.completed;
        }
    });
}

// Delete Note
const deleteNote = function (id) {
    const noteIndex = notes.findIndex(function (note) {
        return note.id === id;
    });
    
    if (noteIndex > -1) {
        notes.splice(noteIndex, 1)
    }
}

// Edit Note
const editNote = function (id) {
    const noteIndex = notes.findIndex(function (note) {
        return note.id === id;
    });

    if (noteIndex > -1) {
        location.assign(`./edit-note.html#${id}`);
    } 
}


// Filter and Render Notes
const renderNotes = function (notes, filters) {
    const filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    // Remove all Notes from #notes-list
    document.querySelector('.notes').innerHTML = '';

    const customerTemplateText = document.getElementById('notes-list').innerHTML;
    const createCustomersHTML = Handlebars.compile(customerTemplateText);
    document.querySelector('.notes').insertAdjacentHTML("beforeend", createCustomersHTML(filteredNotes));
};
    