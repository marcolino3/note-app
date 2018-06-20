

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
        this.createDate = Date.now();
        this.editedDate = Date.now();
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            dueDate: this.dueDate,
            completed: this.completed,
            createDate: this.createDate,
            editedDate: this.editedDate
        };
    }

}

export default Note;