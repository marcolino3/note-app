// Model
class Note {
    constructor(
        id,
        title, 
        description, 
        priority,
        dueDate,
        completed,
        createdDate,
        editedDate) { 
            this.id = id;
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.dueDate = dueDate;
            this.completed = false;
            this.createdDate = createdDate;
            this.editedDate = editedDate;
    }

    // Getter
    getTitle() {
        return this.title;
    }
    getDescription() {
        return this.description;
    }
    getPriority() {
        return this.priority;
    }
    getDueDate() {
        return this.dueDate;
    }
    getCreatedDate() {
        return this.createdDate;
    }
    getEditedDate() {
        return this.editedDate;
    }

    // Setter
    setTitle(title) {
        this.title = title;
    }
    setDescription(description) {
        this.description = description;
    }
    setPriority(priority) {
        this.priority = priority;
    }
    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }
    setEditedDate() {
        this.editedDate = this.editedDate;
    }
}



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

    const note = new Note(
        uuidv4(),
        e.target.elements.title.value,
        e.target.elements.description.value,
        e.target.elements.priority.value,
        Date.now(),
        false,
        Date.now(),
        Date.now()
    );

    notes.push(note);

    saveNotes(notes);
    location.assign('./index.html');
});

// Delete Note
document.querySelector('#delete-note').addEventListener('click', function (e) {
    deleteNote(note.id);
});

// Button Show All Notes
const showAllNotesBtn = document.querySelector('#show-notes');
showAllNotesBtn.addEventListener('click', function () {
    location.assign('./index.html');
});
