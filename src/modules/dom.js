import "../style/dom.css";
import mediator from "./mediator";

import tasksImj from "../imj/tasks.png";
import todayImj from "../imj/todaa.png";
import laterImj from "../imj/later.png";

function loadDom() {
  const addProjectBtn = document.getElementById("add-project-btn");
  const dialog = document.getElementById("dialog");
  const closeDialog = document.getElementById("close-dialog");
  const cancelProject = document.getElementById("cancel-project");
  const addProject = document.getElementById("add-project");
  const projectNameInput = document.getElementById("project-name");
  const projectsSection = document.getElementById("projects-list");
  const sectionTitle = document.getElementById("section-title");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskDialog = document.getElementById("task-dialog");
  const closeTaskDialog = document.getElementById("close-task-dialog");
  const cancelTask = document.getElementById("cancel-task");
  const addTask = document.getElementById("add-task");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescInput = document.getElementById("task-desc");
  const taskDueDateInput = document.getElementById("task-due-date");
  const taskPriorityInput = document.getElementById("task-priority");
  const tasksList = document.getElementById("tasks-list");
  const editTaskDialog = document.getElementById("edit-task-dialog");
  const closeEditTaskDialog = document.getElementById("close-edit-task-dialog");
  const cancelEditTask = document.getElementById("cancel-edit-task");
  const saveTask = document.getElementById("save-task");
  const editTaskTitleInput = document.getElementById("edit-task-title");
  const editTaskDescInput = document.getElementById("edit-task-desc");
  const editTaskDueDateInput = document.getElementById("edit-task-due-date");
  const editTaskPriorityInput = document.getElementById("edit-task-priority");
  let currentSection = "All my tasks";
  let currentEditingTask = null;

  const tasksImg = new Image();
  tasksImg.src = tasksImj;

  const todayImg = new Image();
  todayImg.src = todayImj;

  const laterImg = new Image();
  laterImg.src = laterImj;

  let Box1 = document.getElementById("box1");
  Box1.appendChild(tasksImg);

  let Box2 = document.getElementById("box2");
  Box2.appendChild(todayImg);

  let Box3 = document.getElementById("box3");
  Box3.appendChild(laterImg);

  // add the home elemnts to the projects list
  let ulElements = document.getElementById("home-elem");
  let navItems = ulElements.getElementsByClassName("nav-item");

  let navItemsArray = Array.from(navItems);
  navItemsArray.forEach((item) => {
    mediator.createProject(item.innerHTML);
  });

  // Initialize navigation
  function initNavigation() {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        currentSection = event.target.dataset.section;
        sectionTitle.textContent = currentSection;
        displayTodos(currentSection);
      });
    });
  }

  // Show the dialog when the "Add Project" button is clicked
  addProjectBtn.addEventListener("click", () => {
    dialog.style.display = "flex";
  });

  // Close the dialog
  closeDialog.addEventListener("click", () => {
    dialog.style.display = "none";
    projectNameInput.value = "";
  });

  cancelProject.addEventListener("click", () => {
    dialog.style.display = "none";
    projectNameInput.value = "";
  });

  // Add the project
  addProject.addEventListener("click", () => {
    const projectName = projectNameInput.value.trim();
    if (projectName !== "") {
      mediator.createProject(projectName);
      const projectItem = document.createElement("li");
      projectItem.textContent = projectName;
      projectItem.classList.add("nav-item");
      projectItem.dataset.section = projectName;
      projectsSection.appendChild(projectItem);

      saveProjectsTolocalStorage();

      dialog.style.display = "none";
      projectNameInput.value = "";
      initNavigation();
    }
  });

  // Show the task dialog when the "Add Task" button is clicked
  addTaskBtn.addEventListener("click", () => {
    taskDialog.style.display = "flex";
  });

  // Close the task dialog
  closeTaskDialog.addEventListener("click", () => {
    taskDialog.style.display = "none";
    clearTaskInputs();
  });

  cancelTask.addEventListener("click", () => {
    taskDialog.style.display = "none";
    clearTaskInputs();
  });

  // Add the task
  addTask.addEventListener("click", () => {
    const taskTitle = taskTitleInput.value.trim();
    const taskDesc = taskDescInput.value.trim();
    const taskDueDate = taskDueDateInput.value;
    const taskPriority = taskPriorityInput.value;

    if (taskTitle !== "") {
      mediator.createTodo(
        currentSection,
        taskTitle,
        taskDesc,
        taskDueDate,
        taskPriority,
      );
      saveToDoToLocalStorage(currentSection);

      if (currentSection !== "All my tasks") {
        mediator.createTodo(
          "All my tasks",
          taskTitle,
          taskDesc,
          taskDueDate,
          taskPriority,
        );
        saveToDoToLocalStorage("All my tasks");
      }

      displayTodos(currentSection);
      taskDialog.style.display = "none";
      clearTaskInputs();
    }
  });

  // Show the edit task dialog
  function showEditTaskDialog(task) {
    currentEditingTask = task;
    editTaskTitleInput.value = task.title;
    editTaskDescInput.value = task.description;
    editTaskDueDateInput.value = task.dueDate;
    editTaskPriorityInput.value = task.priority;
    editTaskDialog.style.display = "flex";
  }

  // Close the edit task dialog
  if (closeEditTaskDialog != null) {
    closeEditTaskDialog.addEventListener("click", () => {
      editTaskDialog.style.display = "none";
      currentEditingTask = null;
      clearEditTaskInputs();
    });
  }

  if (cancelEditTask != null) {
    cancelEditTask.addEventListener("click", () => {
      editTaskDialog.style.display = "none";
      currentEditingTask = null;
      clearEditTaskInputs();
    });
  }

  // Save the edited task
  if (saveTask != null) {
    saveTask.addEventListener("click", () => {
      const newTitle = editTaskTitleInput.value.trim();
      const newDesc = editTaskDescInput.value.trim();
      const newDueDate = editTaskDueDateInput.value;
      const newPriority = editTaskPriorityInput.value;

      if (currentEditingTask && newTitle !== "") {
        currentEditingTask.title = newTitle;
        currentEditingTask.description = newDesc;
        currentEditingTask.dueDate = newDueDate;
        currentEditingTask.priority = newPriority;
        displayTodos(currentSection);
        saveToDoToLocalStorage(currentSection);
        editTaskDialog.style.display = "none";
        currentEditingTask = null;
        clearEditTaskInputs();
      }
    });
  }

  // Display todos in the current section
  function displayTodos(section) {
    tasksList.innerHTML = "";

    const todos = mediator.getTodos(section);

    todos.forEach((todo) => {
      const todoItem = document.createElement("li");

      const todoCheckbox = document.createElement("input");
      todoCheckbox.type = "checkbox";
      todoCheckbox.checked = todo.done;
      todoCheckbox.addEventListener("change", () => {
        todo.done = todoCheckbox.checked;
      });

      const todoTitle = document.createElement("span");
      todoTitle.textContent = todo.title;
      todoTitle.classList.add("task-title");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        mediator.deleteTodo(section, todo.title);
        saveToDoToLocalStorage(section);
        displayTodos(section);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        showEditTaskDialog(todo);
      });

      const taskActions = document.createElement("div");
      taskActions.classList.add("task-actions");
      taskActions.appendChild(editButton);
      taskActions.appendChild(deleteButton);

      todoItem.appendChild(todoCheckbox);
      todoItem.appendChild(todoTitle);
      todoItem.appendChild(taskActions);

      tasksList.appendChild(todoItem);
    });
  }

  // Clear task input fields
  function clearTaskInputs() {
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskDueDateInput.value = "";
    taskPriorityInput.value = "low";
  }

  // Clear edit task input fields
  function clearEditTaskInputs() {
    editTaskTitleInput.value = "";
    editTaskDescInput.value = "";
    editTaskDueDateInput.value = "";
    editTaskPriorityInput.value = "low";
  }

  function saveProjectsTolocalStorage() {
    // save the project and the todos to local storage
    const projects = mediator.getProjects();

    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function saveToDoToLocalStorage(projectName) {
    const todos = mediator.getTodos(projectName);
    localStorage.setItem(projectName, JSON.stringify(todos));
  }

  function retriveFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem("projects"));
    const todos = JSON.parse(localStorage.getItem("todos"));
    console.log(projects);

    if (projects) {
      projects.forEach((project) => {
        if (
          project.name !== "All my tasks" &&
          project.name !== "Today" &&
          project.name !== "Todo later"
        ) {
          mediator.createProject(project.name);
          const projectItem = document.createElement("li");
          projectItem.textContent = project.name;
          projectItem.classList.add("nav-item");
          projectItem.dataset.section = project.name;
          projectsSection.appendChild(projectItem);
        }

        const todos = JSON.parse(localStorage.getItem(project.name));
        console.log(project.name);
        if (todos) {
          todos.forEach((todo) => {
            mediator.createTodo(
              project.name,
              todo.title,
              todo.description,
              todo.dueDate,
              todo.priority,
            );
          });
        }
      });
    }
  }
  // Initial setup
  retriveFromLocalStorage();
  sectionTitle.textContent = currentSection;
  displayTodos(currentSection);
  initNavigation();
}

export default loadDom;
