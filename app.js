//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoContainer = document.querySelector(".todo-container");
const filterOption = document.querySelector(".filter-todo");

//Global vars
const categories = {};
let todoStore = getTodoStore();

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTodo(e);
  }
});
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
    completed: false
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
    const cDiv = categoryDiv(category);
    todoContainer.appendChild(cDiv);
    //Add to local category list HTML map & add to UI datalist
    categories[category] = cDiv.querySelector("ul");
    const opt = document.createElement("option");
    opt.value = category;
    document.querySelector('#categories').appendChild(opt);
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
  } if (eventTarget.tagName === "INPUT" && eventTarget.parentElement.classList[0] === "balloon" && eventTarget.parentElement.classList[1] === "completed-balloon") {
    const category = eventTarget.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("H1")[0].innerHTML;
    const todoName = eventTarget.parentElement.parentElement.getElementsByTagName("LI")[0].innerHTML;
    const todoObj = fetchTodoEntry(category, todoName);
    let oldTodo = {};
    Object.assign(oldTodo, todoObj);
    todoObj.completed = todoObj.completed ? false : true;
    updateLocalTodos(category, oldTodo, todoObj);
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
  todoStore = todos;
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(categoryName, todoDiv) {
  let todos = getTodoStore(), todoIndex = todoDiv.children[0].innerHTML;
	todos[categoryName].splice(todos[categoryName].indexOf(todos[categoryName].find(todo => todo.name === todoIndex)), 1);
  todoStore = todos;
  localStorage.setItem("todos", JSON.stringify(todos));
}
function updateLocalTodos(categoryName, todoOld, todoNew) {
  let todos = getTodoStore();
  todos[categoryName].splice(todos[categoryName].indexOf(todos[categoryName].find(todo => todo.name === todoOld.name)), 1, todoNew);
  todoStore = todos;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todoData = getTodoStore();
  //Create category dividers
  Object.keys(todoData).map((key) => {
    const cDiv = categoryDiv(key);
    const todoList = cDiv.querySelector("ul");
    //Add to local category list HTML map & UI datalist
    categories[key] = todoList;
    const opt = document.createElement("option");
    opt.value = key;
    document.querySelector('#categories').appendChild(opt);
    const todos = todoData[key];
    //Create todo items
    todos.forEach(function(todo) {
      const todoDiv = configuredTodoDiv(todo);
      //Add configured todo div to list container
      if (todoDiv) todoList.appendChild(todoDiv);
    });
    todoContainer.appendChild(cDiv);
  });
}
function getTodoStore() {
  let todos, parsed;
  if (typeof localStorage.getItem("todos") === 'string') {
    try {
      parsed = JSON.parse(localStorage.getItem("todos"));
      if (parsed == null || !(typeof parsed === 'object')) parsed = {};
    } catch (SyntaxError) {
      parsed = {};
    }
    todos = parsed;
  } else {
    todos = {};
  }
  return todos;
}
function fetchTodoEntry(category, todoName) {
  const todoList = todoStore[category];
  if (!todoList) return;
  return todoList.find(todoInfo => todoInfo.name === todoName);
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
  completed.innerHTML = 'Done?<input type="checkbox" ' + (todo.completed ? 'checked' : '') + '/>';
  todoDiv.appendChild(completed);
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
function categoryDiv(category) {
  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("todo-category");
  const categoryName = document.createElement("h1");
  categoryName.innerText = category;
  categoryDiv.appendChild(categoryName);
  const todoList = document.createElement('ul');
  todoList.classList.add("todo-list");
  categoryDiv.appendChild(todoList);
  return categoryDiv;
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
