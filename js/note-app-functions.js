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

// Delete Note
const deleteNote = function (id) {
    const noteIndex = notes.findIndex(function (note) {
        return note.id === id;
    });

    if (noteIndex > -1) {
        notes.splice(noteIndex, 1)
    }
}

// Filter and Render Notes
const renderNotes = function (notes, filters) {
    const filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    document.querySelector('#notes-list').innerHTML = '';

    filteredNotes.forEach(function (note) {
        // Create Note Element
        const noteElement = document.createElement('div');

        // Create Checkbox
        const checkboxCompleted = document.createElement('input');
        checkboxCompleted.setAttribute('type', 'checkbox');
        checkboxCompleted.checked = note.completed;
        noteElement.appendChild(checkboxCompleted);

        // Create Title
        const noteTitle = document.createElement('span');
        noteTitle.textContent = note.title;
        noteElement.appendChild(noteTitle);

        // Create Description
        const noteDescription = document.createElement('span');
        noteDescription.textContent = note.description;
        noteElement.appendChild(noteDescription);

        // Create Priority
        const notePriority = document.createElement('span');
        notePriority.textContent = note.priority;
        noteElement.appendChild(notePriority);

        // Create Delete Button
        const noteDeleteBtn = document.createElement('button');
        noteDeleteBtn.textContent = 'x';
        noteElement.appendChild(noteDeleteBtn);
        noteDeleteBtn.addEventListener('click', function (e) {
            deleteNote(note.id);
            saveNotes(notes);
            renderNotes(notes, filters);
        });



        // Add Element to Note List
        const notesList = document.querySelector('#notes-list');
        notesList.appendChild(noteElement);
    });
    
  
}