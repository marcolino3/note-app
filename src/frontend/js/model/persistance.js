
class Persistance {
    constructor() {
        this.notes = 'http://localhost:3000/notes';
    }

    writeToStorage(notes) {



        // localStorage.setItem('notes', JSON.stringify(notes));
    }

    async readFromStorage() {
        try {
            const response = await fetch(this.notes);
            const notes = await response.json();
            return notes;
        } catch (err) {
            console.log('Unable to get data from database');
        }
    }

    async deleteNoteFromStorage(id) {
        try {
            await fetch(`${this.notes}/${id}`, {method: 'DELETE'});
        } catch (err) {
            console.log('Unable to delete data from database'); 
        } 
    }
}

export default Persistance;