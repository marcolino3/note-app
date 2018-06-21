class NoteService {
    constructor(serviceContext) {
        this.serviceContext = serviceContext; 
        this.maxPriority = 3;
        this.minPriority = 1;       
    }

    async getAllNotes() {
        return await this.serviceContext.persistance.readNotesFromStorage();
    }

    async getNote(id) {
        const allNotes = await this.getAllNotes();
        return await allNotes.notes.filter((note) => note._id === id);
    }

    async addNote(note) {
        await this.serviceContext.persistance.addNoteToStorage(note);
    }
    
    async deleteNote(id) { 
        await this.serviceContext.persistance.deleteNoteFromStorage(id);
    }

    async incrementPriority(id) {
        const selectedNote = await this.serviceContext.persistance.readSelectedNoteFromStorage(id);
        if (selectedNote.note.priority < this.maxPriority) {
            selectedNote.note.priority++;
            this.serviceContext.persistance.updateNoteInStorage(selectedNote.note);
        }
    }

    async decrementPriority(id) {
        const selectedNote = await this.serviceContext.persistance.readSelectedNoteFromStorage(id);
        if (selectedNote.note.priority > this.minPriority) {
            selectedNote.note.priority--;
            this.serviceContext.persistance.updateNoteInStorage(selectedNote.note);
        }  
    }

    async toggleCompleted(id) {  
        const selectedNote = await this.getNote(id); 
        selectedNote[0].completed = !selectedNote[0].completed; 
        selectedNote[0].completedAt = Date.now(); 
        selectedNote[0].editedAt = Date.now(); 
        console.log(selectedNote);
    }
    
}

export default NoteService;