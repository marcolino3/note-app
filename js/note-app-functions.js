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

    console.log(filteredNotes);
    
    
    // // Create Note Element
    // const noteElement = document.createElement('div');

    // // Create Checkbox Completed
    // const checkboxCompleted = document.createElement('input');
    // checkboxCompleted.setAttribute('type', 'checkbox');
    // checkboxCompleted.checked = note.completed;
    // noteElement.appendChild(checkboxCompleted);

    // // Create Due Date
    // const dueDate = document.createElement('span');
    // dueDate.textContent = note.dueDate;
    // noteElement.appendChild(dueDate);

    // // Create Title Element
    // const titleElement = document.createElement('span');
    // titleElement.textContent = note.title;
    // noteElement.appendChild(titleElement);
    
    // // Create Description Element
    // const descriptionElement = document.createElement('');
    // descriptionElement.textContent = note.description;
    // noteElement.appendChild(descriptionElement);

    // // Create Priority Element
    // const priorityElement = document.createElement('span');
    // priorityElement.textContent = note.priority;
    // noteElement.appendChild(priorityElement);

    // notesList.appendChild(noteElement);
}