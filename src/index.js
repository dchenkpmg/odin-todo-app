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

  document.querySelectorAll(".project-button").addEventListener("")

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

  addTodoButton.addEventListener("click", () => {
    
  })

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
      completed: false, // New property
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
    // Make the paragraph editable on click
    editableParagraph.addEventListener("click", () => {
      editableParagraph.setAttribute("contenteditable", "true");
      editableParagraph.focus();
    });
    // Save the content when the user finishes editing (on blur event)
    editableParagraph.addEventListener("blur", () => {
      editableParagraph.removeAttribute("contenteditable");
      const content = editableParagraph.textContent;
      currentProject.todos[index].description = content; // Update the Todo description
      projects.saveProjects(); // Save the updated projects to localStorage
    });

    // Optional: Save the content when the user presses Enter (on keydown event)
    editableParagraph.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent inserting a newline
        editableParagraph.blur(); // Trigger the blur event to save content
      }
    });

    // Save the checkbox status when it changes
    checkBox.addEventListener("change", () => {
      currentProject.todos[index].completed = checkBox.checked; // Update the Todo completed status
      projects.saveProjects(); // Save the updated projects to localStorage
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
