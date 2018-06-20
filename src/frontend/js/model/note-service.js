class NoteService {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;

        this.notes = this.getAllNotes() || [];        
    }

    getAllNotes() {
        return this.serviceContext.persistance.readFromStorage();
    }

    addNote(note) {
        this.notes.push(note);
    }

    saveNotes() {
        this.serviceContext.persistance.writeToStorage(this.notes);
    }
    // Todo
    deleteNote(id) {
        const noteIndex = this.notes.findIndex(function (note) {
            return note.id === id;
        });
    
        if (noteIndex > -1) {
            this.notes.splice(noteIndex, 1)
        }
    }

    // Todo
    editNote(id) {
        const noteIndex = notes.findIndex(function (note) {
            return note.id === id;
        });
    
        if (noteIndex > -1) {
            location.assign(`./edit-note.html#${id}`);
        }
    }

    toggleCompleted(id) {  
        const noteId = id;
        let noteIndex = this.notes.findIndex( function (note) {
            return noteId === id;   
        });

        console.log(noteIndex);
        
    }
    
}

export default NoteService;