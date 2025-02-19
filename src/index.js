// src/index.js
import "./styles.css";
import createElement from "./utils.js";
import { Projects, Project } from "./objects.js";

const todoButtonListenerAdded = false;

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
    projectButtonContainer.setAttribute("data-project-index", `${index}`); // Set the data attribute on the container
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
      console.log("Project Clicked!");
      const parentElement = e.target.parentElement;
      const projectIndex = parseInt(
        parentElement.getAttribute("data-project-index")
      );

      const todoList = document.querySelector(".todo-list");
      todoList.textContent = "";
      addTodoButtonListener(projectIndex);
    });
  });

  // Add event listeners to delete buttons
  addDeleteButtonListeners();
}

function addDeleteButtonListeners() {
  document.querySelectorAll(".delete-project-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Delete Clicked!");
      const parentElement = e.target.parentElement;
      const projectIndex = parseInt(
        parentElement.getAttribute("data-project-index")
      );
      console.log(`Project index: ${projectIndex}`);
      // Remove the project from the projects list
      projects.removeProject(projectIndex);
      // Re-render the project list to update indices
      renderProjectList();
    });
  });
}

function addTodoButtonListener(projectIndex) {
  const modal = document.querySelector(".modal");
  const addTodoButton = document.querySelector(".add-todo-button");
  const closeModalButton = document.querySelector(".close-btn");
  const modalSubmit = document.querySelector(`button[type="submit"]`);

  if (!todoButtonListenerAdded) {
    addTodoButton.addEventListener("click", () => {
      modal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"; // This hides the modal when clicking outside of the modal content
      }
    });

    modalSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const details = document.querySelector("#details").value;
      const deadline = document.querySelector("#deadline").value;
      projects.listProjects()[projectIndex].addTodo();
      console.log("HUUUH");
      modal.style.display = "none";
      renderTodoList(projectIndex);
    });

    todoButtonListenerAdded = true;
  }
}

function renderTodoList(projectIndex) {
  const currentProject = projects.listProjects()[projectIndex];
  const todoList = document.querySelector(".todo-list");
  todoList.textContent = ""; // Clear the existing todo list
  currentProject.todos.forEach((todo, index) => {
    const newTodo = createElement("div", null, todoList, "todo-item");
    newTodo.setAttribute("data-todo-index", index);
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "activeCheckbox");
    newTodo.appendChild(checkBox);
    const todoText = document.createElement("span");
    todoText.textContent = todo.name; // Assuming each todo has a 'name' property
    newTodo.appendChild(todoText);
    const changePriorityButton = createElement(
      "button",
      "Change Priority",
      newTodo
    );
    const deadline = document.createElement("p");
    deadline.textContent = todo.deadline; // Assuming each todo has a 'deadline' property
    newTodo.appendChild(deadline);
    const deleteButton = createElement(
      "button",
      "Delete",
      newTodo,
      "delete-button"
    );
  });
}

const projects = new Projects();

renderProjectList();

document.querySelector(".add-project-button").addEventListener("click", (e) => {
  projects.addProject();
  renderProjectList();
});
