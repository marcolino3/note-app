import StyleSwitcher from "./../helper/style-switcher.js";

class Controller {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;
        this.noteTemplate = null;
        this.editNoteTemplate = null;
        this.allNotes = {
            notes: [],
            context: 'all',
            orderedBy: '',
            searchText: ''
        };
        this.filteredNotes = this.allNotes;
        this.selectedNoteId = '',
        this.styleSwitcher = new StyleSwitcher();
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
        try {
            this.noteTemplate =  await Handlebars.compile($("#notes-list").html());
            await $('.notes').html(this.noteTemplate(await this.filteredNotes));
        } catch (err) {
            console.log(err); 
        }
    } 

    // Init UI
    async initUI() {
        await this.getAllNotes();
        await this.initTemplates();
        await this.registerEvents();  
        this.styleSwitcher.getStyle();
        
        // await this.checkStyle();
    }

    // Update UI
    async updateUI() {
        await this.initTemplates();
    }


    // Filter and Sort Buttons
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

    resetActiveToSort() {
        $('.action__area_sort-by-due-date-btn').removeClass('active');
        $('.action__area_sort-by-created-date-btn').removeClass('active');
        $('.action__area_sort-by-priority-btn').removeClass('active');
    }

    resetActiveToFilter() {
        $('.action__area_show-completed-btn').removeClass('active');
        $('.action__area_show-uncompleted-btn').removeClass('active');
        $('.action__area_show-all-notes-btn').removeClass('active');
    }


    

    registerEvents() {

        // Create Note Button
        $('#create-note').on('click', () => location.assign('edit.html'));

        // Style Switcher
        this.styleSwitcher.registerEvents();

        // Search Text
        $('#search-text').on('input', async (e) => {
            this.filteredNotes.searchText = $('#search-text').val();
            await this.getAllNotes();
            await this.updateUI();
        });

        // Reset Search Text Btn
        $('#reset-search-text').on('click', async () => {
            this.filteredNotes.searchText = '';
            $('#search-text').val(this.filteredNotes.searchText);
            await this.getAllNotes();
            await this.updateUI();
        });

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

            this.resetActiveToFilter();
            this.setActive('#show-completed-btn'); 
        });

        // Show Uncompleted Notes Button
        $('#show-uncompleted-btn').on('click', async () => {
            this.filteredNotes.context = 'uncompleted';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActiveToFilter();
            this.setActive('#show-uncompleted-btn'); 
        });


        // Sort by Priority Button Button
        $('#sort-by-priority-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'priority';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActiveToSort();
            this.setActive('#sort-by-priority-btn'); 
        });

        // Sort by Created Date Button
        $('#sort-by-created-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'createdAt';

            await this.getAllNotes();
            await this.updateUI();

            this.resetActiveToSort()
            this.setActive('#sort-by-created-date-btn');
        });

        // Sort by Due Date Button
        $('#sort-by-due-date-btn').on('click', async () => {
            this.filteredNotes.orderedBy = 'dueDate';
            
            await this.getAllNotes();
            await this.updateUI();

            this.resetActiveToSort()
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