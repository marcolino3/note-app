import Note from "./model/note.js";

class Controller {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;
        this.noteTemplate = null;
        this.allNotes = {
            notes: [],
            context: 'all',
            orderedBy: ''
        };
        this.filteredNotes = {};
    }

    // Get All Notes from DB, Format Date and Reverse Order
    async getAllNotes() {

        // Get Notes from DB
        const getAllNotesFromDB = await this.serviceContext.noteService.getAllNotes();

        // Format Dates mit moment.js
        await getAllNotesFromDB.notes.forEach((note) => {
            note.createdAt = moment(note.createdAt).format('MMMM Do YYYY');
            note.editedAt = moment(note.editedAt).format('MMMM Do YYYY');
            note.dueDate = moment(note.dueDate).format('dddd, MMMM Do YYYY');
        });

        // Reverse Order of Notes (latest first)
        await getAllNotesFromDB.notes.reverse();

        this.filteredNotes.notes = getAllNotesFromDB.notes.filter((note) => {
            if (this.filteredNotes.context === 'completed') {
                return note.completed === true;
            } else if (this.filteredNotes.context === 'uncompleted') {
                return note.completed === false;
            } else {
                return true;
            }
        });

        this.filteredNotes.notes = this.filteredNotes.notes.sort((a, b) => {
            if (this.filteredNotes.orderedBy === 'priority') {
                if (a.priority > b.priority) {
                    return -1;
                } else if (b.priority > a.priority) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (this.filteredNotes.orderedBy === 'createdAt') {
                if (a.createdAt > b.createdAt) {
                    return -1;
                } else if (b.createdAt > a.createdAt) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (this.filteredNotes.orderedBy === 'dueDate') {
                if (a.dueDate > b.dueDate) {
                    return -1;
                } else if (b.dueDate > a.dueDate) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });      
        
    }

    // Handlebars: Prepare Rendering
    async renderTemplate(notesToRender) {
        await $('.notes').html(this.noteTemplate(await notesToRender));
    }

    // Handlebars: Compile Rendering
    async initTemplates() {
        try {
            this.noteTemplate =  await Handlebars.compile($("#notes-list").html());
            this.renderTemplate(await this.filteredNotes);
        } catch (err) {
            console.log(err); 
        }
    }

    // Init UI
    async initUI() {
        await this.getAllNotes();
        await this.initTemplates();
        await this.registerEvents();           
    }

    // Update UI
    async updateUI() {
        await this.initTemplates();
    }

    async updateFilteredNotes() {
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
            this.filteredNotes.context = 'all';
            await this.getAllNotes();
            await this.updateUI();
        });

        // Show Completed Notes Button
        $('#show-completed-btn').on('click', async () => {
            this.filteredNotes.context = 'completed';
            await this.getAllNotes();
            await this.updateUI();
            
        });

        // Show Uncompleted Notes Button
        $('#show-uncompleted-btn').on('click', async () => {
            this.filteredNotes.context = 'uncompleted';
            await this.getAllNotes();
            await this.updateUI();
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
        $('.notes').on('click', async (e) => {

            // Delete Note
            if (e.target.className === 'note__delete-btn') {
                // Update DB
                this.serviceContext.noteService.deleteNote(e.target.dataset.id);   

                // Update View for faster reload
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                this.filteredNotes.notes.splice(noteIndex, 1);
                this.updateUI();

                // Update State
                await this.updateFilteredNotes();
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
                this.updateFilteredNotes();
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
                
                console.log(this.filteredNotes);
                
                // Update View
                const noteIndex = this.filteredNotes.notes.findIndex((note) => note._id === e.target.dataset.id);
                this.filteredNotes.notes[noteIndex].completed = !this.filteredNotes.notes[noteIndex].completed;
                await this.updateUI();            
            }

        });
    }

}
export default Controller;