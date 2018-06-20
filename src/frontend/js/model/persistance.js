class Persistance {
    constructor() {

    }

    writeToStorage(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    readFromStorage() {
        const notesJSON = localStorage.getItem('notes');

        if (notesJSON !== null) {
            return JSON.parse(notesJSON);
        } else {
            return [];
        }
    }
}

export default Persistance;