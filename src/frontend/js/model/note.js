

class Note {
    constructor(
        title,
        description,
        priority,
        dueDate
    ) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = true;
        this.completedAt = null;
        this.createdAt = Date.now();
        this.editedAt = Date.now();
    }
}

export default Note;