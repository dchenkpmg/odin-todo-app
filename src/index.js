// src/index.js
import "./styles.css";
import createElement from "./utils.js";
import { Projects, Project, Todo } from "./objects.js";

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
  });

  document.querySelectorAll(".project-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const parentElement = e.target.parentElement;
      const projectIndex = parseInt(
        parentElement.getAttribute("data-project-index")
      );
      currentProjectIndex = projectIndex;
      renderTodoList(projectIndex);
      addTodoButtonListener();
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
      priority: "low",
      date: deadline,
    });
    modal.style.display = "none";
    renderTodoList(currentProjectIndex);
    projects.saveProjects();
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
    newTodo.appendChild(checkBox);
    const todoText = document.createElement("span");
    todoText.textContent = todo.description;
    newTodo.appendChild(todoText);
    const changePriorityButton = createElement(
      "button",
      "Change Priority",
      newTodo
    );
    const deadline = document.createElement("p");
    deadline.textContent = todo.date;
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
  });
}

const projects = new Projects();

renderProjectList();

document.querySelector(".add-project-button").addEventListener("click", () => {
  projects.addProject();
  currentProjectIndex = projects.listProjects().length - 1; // Set to the newly added project
  renderProjectList();
  renderTodoList(currentProjectIndex);
  addTodoButtonListener();
});
