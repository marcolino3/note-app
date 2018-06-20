import NoteService from './note-service.js';

class ServiceContext {
    constructor(persistance) {
        this.persistance = persistance;

        this.noteService = new NoteService(this);
    }



}

export default ServiceContext;