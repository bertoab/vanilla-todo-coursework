//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list element
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-item");
  newTodo.innerText = todoInput.value;
  //Save input to local
  saveLocalTodos(todoInput.value);
  //Add to todo div
  todoDiv.appendChild(newTodo);
  //Reset input
  todoInput.value = "";
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
  const todos = todoList.childNodes;
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
  if (todos.categoryName === undefined) {
    todos.categoryName = [];
  }
  todos.categoryName.push(todo)
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos = getTodoStore();
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos = getTodoStore();
  //Create category dividers
  todos.keys().map((key) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("todo-category");
    const categoryName = document.createElement("h1");
    categoryName.innerText = key;
    const todoList = document.createElement(ul);
    todoList.classList.add("todo-list");
    const todos = todos.key;
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
      //Create completed balloon
      const completed = document.createElement("span");
      completed.classList.add("balloon", "completed-balloon");
      completed.innerHTML = 'Done?<input type="checkbox" />';
      completed.firstChild.value = todo.completed;
      //Create submitted balloon
      const submitted = document.createElement("span");
      submitted.classList.add("balloon", "submitted-balloon");
      submitted.innerHTML = 'Sent in?<input type="checkbox" />';
      submitted.firstChild.value = todo.submitted;
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
    date: Date.toDateString(),
    time: Date.toTimeString()
  };
  return obj;
}