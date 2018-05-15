let notes = getSavedNotes()

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
        editDate: Date.now(),
        completed: false
    })

    debugger
    

    saveNotes(notes)
    
})