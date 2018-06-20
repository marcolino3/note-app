
class Persistance {
    constructor() {

    }

    writeToStorage(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    async readFromStorage() {

        try {
            const result = await fetch('http://localhost:3000/notes/');
            const notes = result.json();
            console.log(notes);
        } catch (err) {
            console.log('Unable to fetch data from database');
        }
        
        

    //     const notesJSON = localStorage.getItem('notes');

    //     if (notesJSON !== null) {
    //         return JSON.parse(notesJSON);
    //     } else {
    //         return [];
    //     }
    }
}

export default Persistance;