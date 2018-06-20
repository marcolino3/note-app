

class Note {
    constructor(
        title,
        description,
        priority,
        dueDate
    ) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = Date.parse(dueDate);
        this.completed = false;
        this.completedAt = null;
        this.createdAt = Date.now();
        this.editedAt = Date.now();
    }
}

export default Note;