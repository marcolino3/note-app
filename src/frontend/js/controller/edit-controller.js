import Note from "./../model/note.js";

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

    // Handlebars: Compile Rendering
    async initTemplates() {
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
    } 

    // Init UI
    async initUI() {
        await this.initTemplates();
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
    // Insert Note
    async insertNote() {
        const title = $('#title').val();
        const description = $('#description').val();
        const priority = Number.parseInt($('#priority').val());
        const dueDate = moment($('#due-date').val());
        const newNote = new Note(title, description, priority, dueDate);
        
        this.serviceContext.noteService.addNote(newNote);
    }

    // Edit Note
    async editNote() {
 
            const title = $('#title').val();
            const description = $('#description').val();
            const priority = Number.parseInt($('#priority').val());
            const dueDate = $('#due-date').val();
            await this.serviceContext.noteService.updateNote(
                this.selectedNoteId, 
                title,
                description,
                priority,
                dueDate
            );
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


    registerEvents() {

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

    }

}
export default Controller;