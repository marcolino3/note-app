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
        this.selectedNoteId = '',
        this.style = [];
    }

    // Get All Notes from DB, Format Date and Reverse Order
    async getAllNotes() {

        // Get Notes from DB
        const getAllNotesFromDB = await this.serviceContext.noteService.getAllNotes();

        // Format Dates mit moment.js
        await getAllNotesFromDB.notes.forEach((note) => {
            note.createdAt = moment(note.createdAt).format('MMMM Do YYYY, h:mm');
            note.editedAt = moment(note.editedAt).format('MMMM Do YYYY, h:mm');
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

    // Handlebars: Compile Rendering
    async initTemplates() {
        if ((location.href).toString().includes('edit.html')) {
            try {
                this.selectedNoteId = location.hash.substr(1);


                this.noteTemplate =  await Handlebars.compile($("#edit-note").html());
                await $('.edit-note__wrapper').html(this.noteTemplate(null));

                const selectedNote = await this.serviceContext.noteService.getNote(this.selectedNoteId);
        
                $('#title').val(selectedNote.note.title);
                $('#description').val(selectedNote.note.description);
                $('#priority').val(selectedNote.note.priority);
                $('#due-date').val(moment(selectedNote.note.dueDate).format('YYYY-MM-DD'));

            } catch (err) {
                console.log(err); 
            }
        } else {
            try {
                this.noteTemplate =  await Handlebars.compile($("#notes-list").html());
                await $('.notes').html(this.noteTemplate(await this.filteredNotes));
            } catch (err) {
                console.log(err); 
            }
        }
        
    } 

    // Init UI
    async initUI() {
        await this.getAllNotes();
        await this.initTemplates();
        await this.isUpdate();
        await this.registerEvents();  
        
        // await this.getStyle();
        // await this.checkStyle();
    }

    // Update UI
    async updateUI() {
        await this.initTemplates();
    }

    // Check isUpdate
    async isUpdate() {
        if (location.hash === '') {
            return false;
        } else {
            this.selectedNoteId = location.hash.substr(1);
            return true;
        }
    }
    // Insert NOte
    async insertNote() {
        const title = $('#title').val();
        const description = $('#description').val();
        const priority = Number.parseInt($('#priority').val());
        const dueDate = $('#due-date').val();
        const newNote = new Note(title, description, priority, dueDate);
        console.log(newNote);
        
        this.serviceContext.noteService.addNote(newNote);
    }

    // Edit Note
    async editNote() {
        
        
        // $('.edit-note').on('click', async () => {
            const title = $('#title').val();
            const description = $('#description').val();
            const priority = Number.parseInt($('#priority').val());
            const dueDate = moment($('#due-date').val()).unix();
            await this.serviceContext.noteService.updateNote(
                this.selectedNoteId, 
                title,
                description,
                priority,
                dueDate
            );

            await this.getAllNotes();
            await this.updateUI();
        // });
    }

    async getStyle() {
        
        const styleFromLocalStorage = await localStorage.getItem('style');

        if (styleFromLocalStorage !== null) {
            this.style = styleFromLocalStorage;
        } else {
            this.style = 'dark';
            this.setStyle('dark');
        }    
    }

    async setStyle(style) {
        localStorage.setItem('style', JSON.stringify(style));
    }

    async checkStyle() {
        if (this.style === 'light') {
            $('body').toggleClass('light');
        }
        console.log(this.style);
        
    }

    setActive(button) {
        $(button).toggleClass('active');
    }

    resetActive() {
        $('.action__area_sort-by-due-date-btn').removeClass('active');
        $('.action__area_sort-by-created-date-btn').removeClass('active');
        $('.action__area_sort-by-priority-btn').removeClass('active');
        $('.action__area_show-completed-btn').removeClass('active');
        $('.action__area_show-uncompleted-btn').removeClass('active');
        $('.action__area_show-all-notes-btn').removeClass('active');
    }

    

    registerEvents() {

        /**
         * Events on edit.html
         */


        // Show All Notes Button
        $('#show-notes').on('click', () => location.assign('index.html'));

        // Add or Update Note
        $('#add-note').on('submit', async (e) => {
            e.preventDefault();
            const isUpdate = await this.isUpdate();

            if(isUpdate) {
                await this.editNote(this.selectedNoteId);
            } else {
                await this.insertNote();
            }
            
            location.assign('index.html');
        });

        /**
         * Event on index.html
         */

        // Create Note Button
        $('#create-note').on('click', () => location.assign('edit.html'));

        // Style Switcher
        $('#style-switcher').on('change', () => {
            
            $('body').toggleClass('light');

            if (this.style === 'light') {
                this.style === 'dark';
                this.setStyle(this.style);
            } else if (this.style === 'dark') {
                this.style === 'light';
                this.setStyle(this.style);
            }
            console.log(this.style);
            
        });

        // Search Text
        $('#search-text').on('input', async (e) => {
            this.filteredNotes.searchText = $('#search-text').val();
            await this.getAllNotes();
            await this.updateUI();
        }) ;

        // Show all Notes
        $('#show-all-notes-btn').on('click', async () => {
            this.filteredNotes.context = 'all';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#show-all-notes-btn');
        });

        // Show Completed Notes Button
        $('#show-completed-btn').on('click', async () => {
            this.filteredNotes.context = 'completed';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#show-completed-btn'); 
        });

        // Show Uncompleted Notes Button
        $('#show-uncompleted-btn').on('click', async () => {
            this.filteredNotes.context = 'uncompleted';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#show-uncompleted-btn'); 
        });


        // Sort by Priority Button Button
        $('#sort-by-priority-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'priority';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#sort-by-priority-btn'); 
        });

        // Sort by Created Date Button
        $('#sort-by-created-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'createdAt';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#sort-by-created-date-btn');
        });

        // Sort by Due Date Button
        $('#sort-by-due-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'dueDate';
            
            await this.getAllNotes();
            await this.updateUI();

            this.resetActive();
            this.setActive('#sort-by-due-date-btn');
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

            // Edit Note Button
            if (e.target.className === 'note__edit-note-btn') {
                this.selectedNoteId = e.target.dataset.id;
                location.assign(`/edit.html#${this.selectedNoteId}`);
            }


        });
    }

}
export default Controller;