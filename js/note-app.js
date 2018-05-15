let notes = getSavedNotes()

const filters = {
    searchText: ''
}

renderNotes(notes, filters)


// Search Text Input
const searchTextInput = document.querySelector('#search-text');
searchTextInput.addEventListener('input', function (e) {
    filters.searchText = e.target.value;
    renderNotes(notes, filters);
});