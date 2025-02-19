class Todo {
  constructor() {
    this.active = true;
    this.description = "";
    this.priority = "low";
    this.date = "19/19/1999";
  }

  setActive(active) {
    this.active = active;
  }
  // set
}

class Project {
  constructor(id) {
    this.id = id;
    this.name = "Project";
    this.todos = [];
  }

  addTodo() {
    const todo = new Todo();
    this.todos.push(todo);
  }

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
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
            new Todo(todoData.description, todoData.priority, todoData.date)
        );
        return project;
      });
    }
    return [];
  }
}

export { Projects, Project };
