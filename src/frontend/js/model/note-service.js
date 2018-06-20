class NoteService {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;        
    }

    async getAllNotes() {
        return await this.serviceContext.persistance.readFromStorage();
    }

    async getNote(id) {
        const allNotes = await this.getAllNotes();
        return await allNotes.notes.filter((note) => note._id === id);
    }

    async addNote(note) {
        const allNotes = await this.getAllNotes();
        allNotes.notes.push(note);
        console.log(allNotes);
        
    }

    async saveNotes() {
        await this.serviceContext.persistance.writeToStorage(this.notes);
    }
    
    async deleteNote(id) { 
        this.serviceContext.persistance.deleteNoteFromStorage(id);
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