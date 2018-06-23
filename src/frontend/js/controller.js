import Note from "./model/note.js";

class Controller {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;
        this.noteTemplate = null;
        this.allNotes = {
            notes: [],
            context: 'all',
            orderedBy: '',
            searchText: ''
        };
        this.filteredNotes = this.allNotes;
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

        // Filter Search Text
        this.filteredNotes.notes = await getAllNotesFromDB.notes.filter((note) => {
            if (this.filteredNotes.searchText.length > 0) {
                return JSON.stringify(note).toLowerCase().includes(this.filteredNotes.searchText.toLowerCase().trim());
            } else {
                return true;
            }
        });

        // Filters completed
        this.filteredNotes.notes = this.filteredNotes.notes.filter((note) => {
            if (this.filteredNotes.context === 'completed') {
                return note.completed === true;
            } else if (this.filteredNotes.context === 'uncompleted') {
                return note.completed === false;
            } else {
                return true;
            }
        });

        // OrderBy
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

        /**
         * Event on index.html
         */

        // Create Note Button
        $('#create-note').on('click', () => location.assign('edit.html'));

         // Search Text
         $('#search-text').on('input', async (e) => {
            this.filteredNotes.searchText = $('#search-text').val();
            await this.getAllNotes();
            await this.updateUI();
        }) ;

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
        $('#sort-by-importance-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'priority';
            await this.getAllNotes();
            await this.updateUI();
        });

        // Sort by Created Date Button
        $('#sort-by-created-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'createdAt';
            await this.getAllNotes();
            await this.updateUI();
        });

        // Sort by Due Date Button
        $('#sort-by-due-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'dueDate';
            await this.getAllNotes();
            await this.updateUI();
        });

        // Events on Notes List
        $('.notes').on('click', async (e) => {

            // Delete Note
            if (e.target.className === 'note__delete-btn') {
                await this.serviceContext.noteService.deleteNote(e.target.dataset.id);   
                await this.getAllNotes();
                await this.updateUI();
            }

            // Increment Priority
            if (e.target.className === 'note__priority-btn-plus') {
                await this.serviceContext.noteService.incrementPriority(e.target.dataset.id);
                await this.getAllNotes();
                await this.updateUI();
            }

            // Decrement Priority
            if (e.target.className === 'note__priority-btn-minus') {
                await this.serviceContext.noteService.decrementPriority(e.target.dataset.id);
                await this.getAllNotes();
                await this.updateUI();
            }

            // Toggle Completed
            if (e.target.className === 'note__completed-radio-btn') {
                await this.serviceContext.noteService.toggleCompleted(e.target.dataset.id);
                await this.getAllNotes();
                await this.updateUI();     
            }

        });
    }

}
export default Controller;