// src/modules/logic.js

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  updateDetails({ title, description, dueDate, priority }) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (dueDate) this.dueDate = dueDate;
    if (priority) this.priority = priority;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoTitle) {
    this.todos = this.todos.filter((todo) => todo.title !== todoTitle);
  }

  getTodos() {
    return this.todos;
  }
}

class App {
  constructor() {
    this.projects = [];
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
  }

  removeProject(name) {
    this.projects = this.projects.filter((project) => project.name !== name);
  }

  getProject(name) {
    return this.projects.find((project) => project.name === name);
  }

  getAllProjects() {
    return this.projects;
  }

  addTodoToProject(projectName, todo) {
    const project = this.getProject(projectName);
    if (project) {
      project.addTodo(todo);
    }
  }

  removeTodoFromProject(projectName, todoTitle) {
    const project = this.getProject(projectName);
    if (project) {
      project.removeTodo(todoTitle);
    }
  }
}

export { Todo, Project, App };
