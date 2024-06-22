// src/modules/mediator.js

import { Todo, App } from "./logic";

const mediator = (() => {
  const app = new App();

  const createTodo = (projectName, title, description, dueDate, priority) => {
    const todo = new Todo(title, description, dueDate, priority);
    app.addTodoToProject(projectName, todo);
    return todo;
  };

  const deleteTodo = (projectName, todoTitle) => {
    app.removeTodoFromProject(projectName, todoTitle);
  };

  const createProject = (name) => {
    app.addProject(name);
  };

  const deleteProject = (name) => {
    app.removeProject(name);
  };

  const getProjects = () => {
    return app.getAllProjects();
  };

  const getTodos = (projectName) => {
    const project = app.getProject(projectName);
    return project ? project.getTodos() : [];
  };

  return {
    createTodo,
    deleteTodo,
    createProject,
    deleteProject,
    getProjects,
    getTodos,
  };
})();

export default mediator;
