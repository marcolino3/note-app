
class Persistance {
    constructor() {
        this.notes = 'http://localhost:3000/notes';
    }

    async readNotesFromStorage() {
        try {
            const response = await fetch(this.notes);
            const notes = await response.json();
            return notes;
        } catch (err) {
            console.log('Unable to get data from database');
        }
    }

    async readSelectedNoteFromStorage(id) {
        try {
            const response = await fetch(`${this.notes}/${id}`);
            
            const selectedNote = await response.json();
            console.log(selectedNote);
            
            return selectedNote;
        } catch (err) {
            console.log('Unable to get selected note from database');
        }
    }

    async addNoteToStorage(note) {
        try {
            await fetch(this.notes , {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            });   
        } catch (err) {
            console.log('Unable to add note to database');
        }
    }

    async deleteNoteFromStorage(id) {
        try {
            await fetch(`${this.notes}/${id}`, {method: 'DELETE'});
        } catch (err) {
            console.log('Unable to delete data from database'); 
        } 
    }

    async updateNoteInStorage(note) {
        try {
            await fetch(`${this.notes}/${note._id}` , {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            }); 
        } catch (err) {
            console.log('Unable to update note in database', err);
        }
    }
}

export default Persistance;