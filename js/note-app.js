let notes = getSavedNotes();

const filters = {
    searchText: ''
}


renderUI();



// EventListener on Note
document.querySelector('.notes').addEventListener('click', function (e) {

    // Increment Priority
    if (e.target.className === 'note__priority-btn-plus') {
        incrementPriority(e.target.dataset.id);
        renderUI();
    }

    // Decrement Priority
    if (e.target.className === 'note__priority-btn-minus') {
        decrementPriority(e.target.dataset.id);
        renderUI();
    }

    // Set Completed
    if (e.target.className === 'note__completed-radio-btn'|| 'note__completed-checked') {
        setCompleted(e.target.dataset.id);
        renderUI();
    }

    // Delete Note
    if (e.target.className === 'note__delete-btn-x') {
        deleteNote(e.target.dataset.id);
        renderUI();
    }
});



// Button Create Note
const createNoteBtn = document.querySelector('#create-note');
createNoteBtn.addEventListener('click', function () {
    location.assign('./edit-note.html');
});

// Search Text Input
const searchTextInput = document.querySelector('#search-text');
searchTextInput.addEventListener('input', function (e) {
    filters.searchText = e.target.value;
    renderNotes(notes, filters);
});

// Style Switcher
const layountBtn = document.querySelector('#style-switcher');
layountBtn.addEventListener('change', function () {

    const head = document.querySelector('head');
    
    const styleBlack = document.createElement('link');
    styleBlack.setAttribute('rel', 'stylesheet');
    styleBlack.setAttribute('href', 'css/style-black.css');
    styleBlack.setAttribute('id', 'style-black');

    head.appendChild(styleBlack);
   
});

    
