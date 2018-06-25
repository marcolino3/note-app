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
        return await this.serviceContext.persistance.readSelectedNoteFromStorage(id);
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
        const selectedNote = await this.serviceContext.persistance.readSelectedNoteFromStorage(id);
        selectedNote.note.completed = !selectedNote.note.completed;
        this.serviceContext.persistance.updateNoteInStorage(selectedNote.note);
    }

    async updateNote(id, title, description, dueDate, priority) {
        const selectedNote = {};
        selectedNote.note.id = id;
        selectedNote.note.title = title;
        selectedNote.note.description = description;
        selectedNote.note.dueDate = dueDate;
        selectedNote.note.priority = priority;
        selectedNote.note.completed = completed;
        selectedNote.note.completedAt = completedAt;
        selectedNote.note.createdAt = createAt;
        selectedNote.note.editedAt = editedAt;
        this.serviceContext.persistance.updateNoteInStorage(selectedNote.note);
    }
    
}

export default NoteService;