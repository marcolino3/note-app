filteredNotes.forEach(function (note) {
    // Create Note Element
    const noteElement = document.createElement('a');
    noteElement.setAttribute('class', 'note-element')
    noteElement.addEventListener('dblclick', function (e) {
        editNote(note.id)
    });

    // Create Checkbox
    const checkboxCompleted = document.createElement('input');
    checkboxCompleted.setAttribute('type', 'checkbox');
    checkboxCompleted.checked = note.completed;
    noteElement.appendChild(checkboxCompleted);

    // Create Title
    const noteTitle = document.createElement('span');
    noteTitle.textContent = note.title;
    noteElement.appendChild(noteTitle);

    // Create Description
    const noteDescription = document.createElement('span');
    noteDescription.textContent = note.description;
    noteElement.appendChild(noteDescription);

    // Create Priority
    const notePriority = document.createElement('span');
    notePriority.textContent = note.priority;
    noteElement.appendChild(notePriority);

    // Create Delete Button
    const noteDeleteBtn = document.createElement('button');
    noteDeleteBtn.textContent = 'x';
    noteElement.appendChild(noteDeleteBtn);
    noteDeleteBtn.addEventListener('click', function (e) {
        deleteNote(note.id);
        saveNotes(notes);
        renderNotes(notes, filters);
    });

    // Add Element to Note List
    const notesList = document.querySelector('#notes-list');
    notesList.appendChild(noteElement);