class Todo {
  constructor(
    description = "",
    priority = "low",
    date = "19/19/1999",
    active = true
  ) {
    this.id = Date.now(); // Unique identifier
    this.active = active;
    this.description = description;
    this.priority = priority;
    this.date = date;
  }

  setActive(active) {
    this.active = active;
  }
}

class Project {
  constructor(id) {
    this.id = id;
    this.name = "Project";
    this.todos = [];
  }

  addTodo(todoData) {
    const todo = new Todo(
      todoData.description,
      todoData.priority,
      todoData.date,
      todoData.active
    );
    this.todos.push(todo);
  }

  removeTodo(todoIndex) {
    this.todos.splice(todoIndex, 1);
  }
}

class Projects {
  constructor() {
    this.projects = this.loadProjects();
  }

  addProject() {
    const project = new Project(this.projects.length);
    this.projects.push(project);
    this.saveProjects();
  }

  removeProject(id) {
    this.projects = this.projects.filter((project) => project.id !== id);
    this.projects.forEach((project, index) => {
      project.id = index;
    });
    this.saveProjects();
  }

  listProjects() {
    return this.projects;
  }

  saveProjects() {
    localStorage.setItem("projects", JSON.stringify(this.projects));
  }

  loadProjects() {
    const projects = localStorage.getItem("projects");
    if (projects) {
      const parsedProjects = JSON.parse(projects);
      return parsedProjects.map((projectData) => {
        const project = new Project(projectData.id);
        project.name = projectData.name;
        project.todos = projectData.todos.map(
          (todoData) =>
            new Todo(
              todoData.description,
              todoData.priority,
              todoData.date,
              todoData.active
            )
        );
        return project;
      });
    }
    return [];
  }
}

export { Projects, Project, Todo };
