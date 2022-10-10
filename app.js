//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoContainer = document.querySelector(".todo-container");
const filterOption = document.querySelector(".filter-todo");

//Global vars
const categories = {};

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoContainer.addEventListener("click", interactTodo);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  //Create todo obj
  const todo = {
    name: todoInput.value,
    dueDate: document.querySelector("#duedate").value,
    completed: false,
    submitted: false
  };
  const category = document.querySelector("#category").value;
  //Save todo
  saveLocalTodos(category, todo);
  //Create todo div
  const todoDiv = configuredTodoDiv(todo);
  //Reset input [TODO: make this reset other factors as well!]
  todoInput.value = "";
  // (if it didn't already exist) create category container
  if (!categories[category]) {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("todo-category");
    const categoryName = document.createElement("h1");
    categoryName.innerText = category;
    categoryDiv.appendChild(categoryName);
    const todoList = document.createElement('ul');
    todoList.classList.add("todo-list");
    categoryDiv.appendChild(todoList);
    todoContainer.appendChild(categoryDiv);
    //Add to local category list HTML map
    categories[category] = todoList;
  }
  //Add configured todo div to appropriate category
  if (todoDiv) categories[category].appendChild(todoDiv);
}

function interactTodo(e) {
  const eventTarget = e.target;

  if (eventTarget.classList[0] === "trash-btn") {
    // e.target.parentElement.remove(); //Simple deletion
    const todoDiv = eventTarget.parentElement;
    todoDiv.classList.add("fall"); //Trigger deletion animation
    //Remove from local storage
    removeLocalTodos(eventTarget.parentElement.parentElement.parentElement.firstChild.innerHTML, todoDiv);
    //Set event handler to delete element once transition is completed
    todoDiv.addEventListener("transitionend", e => {
      todoDiv.remove();
    });
  }
  if (eventTarget.classList[0] === "complete-btn") {
    const todoDiv = eventTarget.parentElement;
    todoDiv.classList.toggle("completed"); //Trigger completion animation
    console.log(todoDiv);
  }
}

function filterTodo(e) {
  const todos = todoContainer.childNodes;
  todos.forEach(function(todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(categoryName, todo) {
  let todos = getTodoStore();
  if (todos[categoryName] === undefined) {
    todos[categoryName] = [];
  }
  todos[categoryName].push(todo)
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(categoryName, todoDiv) {
  let todos = getTodoStore();
  const todoIndex = {
		name: todoDiv.children[0].innerHTML,
		dueDate: todoDiv.children[1].value,
		completed: todoDiv.children[2].firstChild.value,
		submitted: todoDiv.children[3].firstChild.value
	};
	todos[categoryName].splice(todos[categoryName].indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todoData = getTodoStore();
  //Create category dividers
  Object.keys(todoData).map((key) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("todo-category");
    const categoryName = document.createElement("h1");
    categoryName.innerText = key;
    categoryDiv.appendChild(categoryName);
    const todoList = document.createElement('ul');
    todoList.classList.add("todo-list");
    categoryDiv.appendChild(todoList);
    //Add to local category list HTML map
    categories[key] = todoList;
    const todos = todoData[key];
    //Create todo items
    todos.forEach(function(todo) {
      const todoDiv = configuredTodoDiv(todo);
      //Add configured todo div to list container
      if (todoDiv) todoList.appendChild(todoDiv);
    });
    todoContainer.appendChild(categoryDiv);
  });
}
function getTodoStore() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = {};
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function dateInfoFromStamp(timestamp) {
  const date = new Date();
  const obj = {
    date: date.toDateString(),
    time: date.toLocaleTimeString("en-us")
  };
  return obj;
}

// HTML Modules
function configuredTodoDiv(todo) {
  if (!todo) return;
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list element
  const newTodo = document.createElement("li");
  newTodo.innerText = todo.name ? todo.name : "";
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  //Create due date block
  const dueDate = dueDateDiv(todo);
  if (dueDate) todoDiv.appendChild(dueDate);
  //Create completed balloon
  const completed = document.createElement("span");
  completed.classList.add("balloon", "completed-balloon");
  completed.innerHTML = 'Done?<input type="checkbox" />';
  completed.firstChild.value = "on"; //DEBUGGING
  todoDiv.appendChild(completed);
  //Create submitted balloon
  const submitted = document.createElement("span");
  submitted.classList.add("balloon", "submitted-balloon");
  submitted.innerHTML = 'Sent in?<input type="checkbox" />';
  submitted.firstChild.value = todo.submitted;
  todoDiv.appendChild(submitted);
  //Create 'Completed' button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create 'Trash' button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  return todoDiv;
}
function dueDateDiv(todo) {
  if (!todo.dueDate) return;
  //Create due date block
  const dueDate = document.createElement("div");
  dueDate.classList.add("due-date");
  const dueDateInfo = dateInfoFromStamp(todo.dueDate);
  dueDate.innerHTML = `${dueDateInfo.date}<br>${dueDateInfo.time}`;
  return dueDate;
}
