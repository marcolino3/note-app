// NoteId based on the hash
const noteId = location.hash.substr(1);
console.log(noteId);

// Notes from LocalStorage
const notes = getSavedNotes()

// Find Note to Edit
let note = notes.find(function (note) {
    return note.id === noteId;
});


/* 
 *  Set Values of Note
 */
note = note || {};

// Set Title
const titleElement = document.querySelector('#title');
titleElement.value = note.title;

// Set Description
const descriptionElement = document.querySelector('#description');
descriptionElement.value = note.description;

// Set Priority
const priorityElement = document.querySelector('#priority');
priorityElement.value = note.priority;

// Set Due Date
const dueDateElement = document.querySelector('#due-date');
dueDateElement.value = note.dueDate;




// Add note
document.querySelector('#add-note').addEventListener('submit', function (e) {
    e.preventDefault()

    notes.push( {
        id: uuidv4(),
        title: e.target.elements.title.value,
        description: e.target.elements.description.value,
        priority: e.target.elements.priority.value,
        dueDate: e.target.elements.dueDate.value,
        createDate: new Date(),
        editDate: Date.now(),
        completed: false
    });
    saveNotes(notes);
    location.assign('./index.html');
});

// Delete Note
document.querySelector('#delete-note').addEventListener('click', function (e) {
    deleteNote(note.id);
    console.log(note.id);
    
});

// Button Show All Notes
const showAllNotesBtn = document.querySelector('#show-notes');
showAllNotesBtn.addEventListener('click', function () {
    location.assign('./index.html');
});
