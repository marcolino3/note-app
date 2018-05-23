let notes = getSavedNotes()

const filters = {
    searchText: ''
}

renderNotes(notes, filters)


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
