let notes = []

// Add note
document.querySelector('#add-note').addEventListener('submit', function (e) {
    e.preventDefault()

    notes.push( {
        id: uuidv4(),
        title: e.target.elements.title.value,
        description: e.target.elements.description.value,
        priority: e.target.elements.priority.value,
        dueDate: e.target.elements.dueDate.value,
        createDate: new Date(),
        editDate: new Date(),
        completed: false
    })

    saveNotes(notes)
    
})

// Save Notes to LocalStorage
const saveNotes = (notes) => localStorage.setItem('notes', JSON.stringify(notes))

// Get Notes from LocalStorage
const getSavedNotes = function () {
    const notesJSON = localStorage.getItem('notes')

    if (notesJSON !== null) {
        return JSON.parse(notesJSON)
    } else {
        return []
    }
}

// Cancel / Reset Button
document.querySelector('#reset').addEventListener('click', function (e) {
    e.preventDefault()
    console.log(e);
    
    // // Reset title
    // e.target.elements.title.value = ''
    // // Reset description
    // e.target.elements.description.value = ''
    // // Reset priority
    // e.target.elements.priority.value = ''
    // // Reset dueDate
    // e.target.elements.dueDate.value = ''
})