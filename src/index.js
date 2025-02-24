import "./styles.css";
import createElement from "./utils.js";
import { Projects, Project, Todo } from "./objects.js";
import { format } from "date-fns";

let currentProjectIndex = null;

function renderProjectList() {
  const projectList = projects.listProjects();
  const projectSidebar = document.querySelector(".all-projects");
  projectSidebar.textContent = "";
  projectList.forEach((project, index) => {
    const projectButtonContainer = createElement(
      "div",
      null,
      projectSidebar,
      "project-button-container"
    );
    projectButtonContainer.setAttribute("data-project-index", `${index}`);
    const projectButton = createElement(
      "button",
      project.name,
      projectButtonContainer,
      "project-button"
    );
    const deleteButton = createElement(
      "button",
      "X",
      projectButtonContainer,
      "delete-project-button"
    );

    projectButton.addEventListener("click", (e) => {
      const parentElement = e.target.parentElement;
      const projectIndex = parseInt(
        parentElement.getAttribute("data-project-index")
      );
      currentProjectIndex = projectIndex;
      renderTodoList(projectIndex);
      addTodoButtonListener();

      document.querySelectorAll(".project-button").forEach((btn) => {
        btn.classList.remove("active");
      });

      projectButton.classList.add("active");
    });
  });

  addDeleteButtonListeners();

  if (projectList.length > 0 && currentProjectIndex === null) {
    currentProjectIndex = 0;
    renderTodoList(currentProjectIndex);
    addTodoButtonListener();
  }
}

function addDeleteButtonListeners() {
  document.querySelectorAll(".delete-project-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const parentElement = e.target.parentElement;
      const projectIndex = parseInt(
        parentElement.getAttribute("data-project-index")
      );
      projects.removeProject(projectIndex);
      renderProjectList();
      document.querySelector(".todo-list").textContent = "";
    });
  });
}

function addTodoButtonListener() {
  const modal = document.querySelector(".modal");
  const addTodoButton = document.querySelector(".add-todo-button");
  const closeModalButton = document.querySelector(".close-btn");
  const modalSubmit = document.querySelector(`button[type="submit"]`);

  addTodoButton.onclick = () => {
    modal.style.display = "block";
  };

  closeModalButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  modalSubmit.onclick = (e) => {
    e.preventDefault();
    const details = document.querySelector("#details").value;
    const deadline = document.querySelector("#deadline").value;
    projects.listProjects()[currentProjectIndex].addTodo({
      description: details,
      priority: "rgb(103, 190, 103)",
      date: deadline,
      completed: false,
    });
    modal.style.display = "none";
    renderTodoList(currentProjectIndex);
    projects.saveProjects();
  };
}

function addProjectButtonListener() {
  const projectModal = document.querySelector("#projectModal");
  const addProjectButton = document.querySelector(".add-project-button");
  const closeProjectModalButton = document.querySelector(".close-btn");
  const projectModalSubmit = document.querySelector(
    "#projectModalForm button[type='submit']"
  );

  addProjectButton.onclick = () => {
    projectModal.style.display = "block";
  };

  closeProjectModalButton.onclick = () => {
    projectModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === projectModal) {
      projectModal.style.display = "none";
    }
  };

  projectModalSubmit.onclick = (e) => {
    e.preventDefault();
    const projectName = document.querySelector("#projectName").value;
    const project = new Project(projects.listProjects().length);
    project.name = projectName;
    projects.projects.push(project);
    projects.saveProjects();
    projectModal.style.display = "none";
    renderProjectList();
  };
}

function renderTodoList(projectIndex) {
  const currentProject = projects.listProjects()[projectIndex];
  if (!currentProject) return;
  const todoList = document.querySelector(".todo-list");
  todoList.textContent = "";
  currentProject.todos.forEach((todo, index) => {
    const newTodo = createElement("div", null, todoList, "todo-item");
    newTodo.setAttribute("data-todo-index", index);
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "activeCheckbox");
    checkBox.checked = todo.completed; // Set the checkbox status
    newTodo.appendChild(checkBox);
    const editableParagraph = document.createElement("p");
    editableParagraph.textContent = todo.description;
    newTodo.appendChild(editableParagraph);
    const changePriorityButton = createElement(
      "button",
      "Change Priority",
      newTodo,
      "priority-button"
    );
    const deadline = document.createElement("p");
    deadline.textContent = format(new Date(todo.date), "dd/MM/yyyy");
    newTodo.appendChild(deadline);
    const deleteButton = createElement(
      "button",
      "Delete",
      newTodo,
      "delete-button"
    );
    deleteButton.addEventListener("click", () => {
      currentProject.removeTodo(index);
      renderTodoList(projectIndex);
      projects.saveProjects();
    });

    editableParagraph.addEventListener("click", () => {
      editableParagraph.setAttribute("contenteditable", "true");
      editableParagraph.focus();
    });

    editableParagraph.addEventListener("blur", () => {
      editableParagraph.removeAttribute("contenteditable");
      const content = editableParagraph.textContent;
      currentProject.todos[index].description = content;
    });

    editableParagraph.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        editableParagraph.blur();
      }
    });

    checkBox.addEventListener("change", () => {
      currentProject.todos[index].completed = checkBox.checked;
      projects.saveProjects();
    });

    const colors = [
      "rgb(103, 190, 103)",
      "rgb(255, 165, 0)",
      "rgb(255, 69, 0)",
    ];
    let currentColorIndex = colors.indexOf(todo.priority);

    newTodo.style.borderLeftColor = todo.priority;

    changePriorityButton.addEventListener("click", () => {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
      const newColor = colors[currentColorIndex];
      newTodo.style.borderLeftColor = newColor;
      currentProject.todos[index].priority = newColor;
      projects.saveProjects();
    });
  });
}

const projects = new Projects();

renderProjectList();
addProjectButtonListener();

document.querySelector(".add-project-button").addEventListener("click", () => {
  const projectModal = document.querySelector("#projectModal");
  projectModal.style.display = "block";
});
