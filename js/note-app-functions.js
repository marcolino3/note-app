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

const renderNotes = function (notes, filters) {
    const filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    document.querySelector('#notes-list').innerHTML = '';

    filteredNotes.forEach(function (note) {
        // Create Note Element
        const noteElement = document.createElement('div');
        noteElement.textContent = note.title;



        // Add Element to Note List
        const notesList = document.querySelector('#notes-list');
        notesList.appendChild(noteElement);
    });
    
  
}