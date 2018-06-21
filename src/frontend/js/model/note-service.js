class NoteService {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;        
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

    async editNote(id) {
        const selectedNote = await this.getNote(id);   
        console.log(selectedNote);
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