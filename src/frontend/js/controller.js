import Note from "./model/note.js";

class Controller {
    constructor(serviceContext) {
        this.serviceContext = serviceContext;
        this.noteTemplate = null;
    }

    
    async initTemplates() {
        try {
            this.noteTemplate =  await Handlebars.compile($("#notes-list").html());
            this.renderTemplate();
        } catch (err) {
            console.log(err);
            
        }
    }
    
    initUI() {
        this.initTemplates();
        this.registerEvents();
    }

    async renderTemplate() {
        await $('.notes').html(this.noteTemplate(await this.getAllNotes()));
    }

    async updateUI() {
        await this.getAllNotes();
        await this.renderTemplate();
    }

    async getAllNotes() {
        return await this.serviceContext.noteService.getAllNotes();
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

        // Events on Notes List
        $('.notes').on('click',(e) => {

            // Set Completed
            if (e.target.className === 'note__completed-radio-btn') {
                this.serviceContext.noteService.toggleCompleted(e.target.dataset.id);
            }

            // Delete Note
            if (e.target.className === 'note__delete-btn') {
                this.serviceContext.noteService.deleteNote(e.target.dataset.id);   
                this.updateUI(); 
            }

            // Increment Priority
            if (e.target.className === 'note__priority-btn-plus') {
                this.serviceContext.noteService.incrementPriority(e.target.dataset.id);
                this.updateUI();
            }

            // Decrement Priority
            if (e.target.className === 'note__priority-btn-minus') {
                this.serviceContext.noteService.decrementPriority(e.target.dataset.id);
                this.updateUI();
            }

        });
    }

}
export default Controller;