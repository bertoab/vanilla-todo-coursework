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
todoContainer.addEventListener("click", deleteTodo);
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
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list element
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-item");
  newTodo.innerText = todo.name;
  //Save input to local
  saveLocalTodos(category, todo);
  //Add to todo div
  todoDiv.appendChild(newTodo);
  //Reset input
  todoInput.value = "";
  //Create due date block
  const dueDate = document.createElement("div");
  dueDate.classList.add("due-date");
  const dueDateInfo = dateInfoFromStamp(todo.dueDate);
  dueDate.innerHTML = `${dueDateInfo.date}<br>${dueDateInfo.time}`;
  todoDiv.appendChild(dueDate);
  //Create completed balloon
  const completed = document.createElement("span");
  completed.classList.add("balloon", "completed-balloon");
  completed.innerHTML = `Done?<input type="checkbox" value="${todo.completed}" />`;
  todoDiv.appendChild(completed);
  //Create submitted balloon
  const submitted = document.createElement("span");
  submitted.classList.add("balloon", "submitted-balloon");
  submitted.innerHTML = `Sent in?<input type="checkbox" value="${todo.submitted}" />`;
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
  categories[category].appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove(); //Simple deletion
    const todo = item.parentElement;
    todo.classList.add("fall"); //Trigger deletion animation
    //Remove from local storage
    removeLocalTodos(todo);
    //Set event handler to delete element once transition is completed
    todo.addEventListener("transitionend", e => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed"); //Trigger completion animation
    console.log(todo);
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
function removeLocalTodos(todo) {
  let todos = getTodoStore();
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
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
      //Create todo div
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      //Create list element
      const newTodo = document.createElement("li");
      newTodo.innerText = todo.name;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);
      todoInput.value = "";  //... reset all input
      //Create due date block
      const dueDate = document.createElement("div");
      dueDate.classList.add("due-date");
      dueDateInfo = dateInfoFromStamp(todo.dueDate);
      dueDate.innerHTML = `${dueDateInfo.date}<br>${dueDateInfo.time}`;
      todoDiv.appendChild(dueDate);
      //Create completed balloon
      const completed = document.createElement("span");
      completed.classList.add("balloon", "completed-balloon");
      completed.innerHTML = 'Done?<input type="checkbox" />';
      completed.firstChild.value = todo.completed;
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
      //Add configured todo div to list container
      todoList.appendChild(todoDiv);
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
