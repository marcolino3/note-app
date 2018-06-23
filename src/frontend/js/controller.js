import Note from "./model/note.js";

class Controller {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;
        this.noteTemplate = null;
        this.allNotes = {};
        this.filteredNotes = {};
    }

    async initTemplates() {
        try {
            this.noteTemplate =  await Handlebars.compile($("#notes-list").html());
            this.renderTemplate(await this.filteredNotes);
        } catch (err) {
            console.log(err); 
        }
    }

    async renderTemplate(notesToRender) {
        await $('.notes').html(this.noteTemplate(await notesToRender));
    }
    
    async initUI() {
        this.allNotes = await this.getAllNotes();
        this.filteredNotes = this.allNotes;
        this.initTemplates();
        this.registerEvents();   
    }


    async updateUI() {
        await this.initTemplates();
    }


    async getAllNotes() {
        const getAllNotesFromDB = await this.serviceContext.noteService.getAllNotes();
        getAllNotesFromDB.notes.reverse();
        const reversedNotes = getAllNotesFromDB;
        return reversedNotes;
    }

    async resetFilteredNotes() {
        this.filteredNotes = await this.getAllNotes();
    }


    registerEvents() {

        /**
         * Events on edit.html
         */

        // Show All Notes Button
        $('#show-notes').on('click', () => location.assign('index.html'));

        // Add Note
        $('#add-note').on('submit', (e) => {
            
            e.preventDefault();
            const title = $('#title').val();
            const description = $('#description').val();
            const priority = Number.parseInt($('#priority').val());
            const dueDate = $('#due-date').val();
    
            const newNote = new Note(title, description, priority, dueDate);
            this.serviceContext.noteService.addNote(newNote);
            
            location.assign('index.html');
        });

        // Delete Note
        $('#delete-note').on('click', (e) => {
            this.serviceContext.noteService.deleteNote(e.target.dataset.id)
        });
        /**
         * Event on index.html
         */

        // Create Note Button
        $('#create-note').on('click', () => location.assign('edit.html'));

        // Show all Notes
        $('#show-allNotes-btn').on('click', async () => {
            this.resetFilteredNotes();
            this.updateUI();
        });

        // Show Completed Notes Button
        $('#show-completed-btn').on('click', async () => {
            this.resetFilteredNotes();
            this.filteredNotes.notes = this.allNotes.notes.filter((note) => note.completed === true);
            this.updateUI();
        });

        // Show Uncompleted Notes Button
        $('#show-uncompleted-btn').on('click', async () => {
            this.resetFilteredNotes();
            this.filteredNotes.notes = this.allNotes.notes.filter((note) => note.completed === false);
            this.updateUI();
        });


        // Sort by Importance Button Button
        $('#sort-by-importance-btn').on('click', () => {
            this.filteredNotes.notes = this.allNotes.notes.sort((a, b) => {
                if (a.priority > b.priority) {
                    return -1
                } else if (b.priority > a.priority) {
                    return 1
                } else {
                    return 0
                }
            });
            this.updateUI();
        });

        // Sort by Created Date Button
        $('#sort-by-created-date-btn').on('click', () => {
            this.filteredNotes.notes = this.allNotes.notes.sort((a, b) => {
                if (a.createdAt > b.createdAt) {
                    return -1
                } else if (b.createdAt > a.createdAt) {
                    return 1
                } else {
                    return 0
                }
            });
            this.updateUI();
        });

        // Sort by Due Date Button
        $('#sort-by-due-date-btn').on('click', () => {
            this.filteredNotes.notes = this.allNotes.notes.sort((a, b) => {
                if (a.dueDate > b.dueDate) {
                    return -1
                } else if (b.dueDate > a.dueDate) {
                    return 1
                } else {
                    return 0
                }
            });
            this.updateUI();
        });

        // Events on Notes List
        $('.notes').on('click',(e) => {

            // Delete Note
            if (e.target.className === 'note__delete-btn') {
                // Update DB
                this.serviceContext.noteService.deleteNote(e.target.dataset.id);   

                // Update View for faster reload
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                this.filteredNotes.notes.splice(noteIndex, 1);
                this.updateUI();
            }

            // Increment Priority
            if (e.target.className === 'note__priority-btn-plus') {
                // Update DB
                this.serviceContext.noteService.incrementPriority(e.target.dataset.id);

                // Update View for faster reload
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                if (this.filteredNotes.notes[noteIndex].priority < 3) {
                    this.filteredNotes.notes[noteIndex].priority++;
                }
                this.updateUI();
            }

            // Decrement Priority
            if (e.target.className === 'note__priority-btn-minus') {
                // Update DB
                this.serviceContext.noteService.decrementPriority(e.target.dataset.id);

                // Update View for faster reload
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                if (this.filteredNotes.notes[noteIndex].priority > 1) {
                    this.filteredNotes.notes[noteIndex].priority--;
                }
                this.updateUI();
            }

            // Toggle Completed
            if (e.target.className === 'note__completed-radio-btn') {
                // Update DB
                this.serviceContext.noteService.toggleCompleted(e.target.dataset.id);
                
                // Update View
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                this.filteredNotes.notes[noteIndex].completed = !this.filteredNotes.notes[noteIndex].completed;
                this.updateUI();
            }

        });
    }

}
export default Controller;