/* ****************************************************************** */
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

//todo reducer
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}
// goal reducer
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}
//addTodo action creator
function addTodoAC(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}
//removeTodo action creator
function removeTodoAC(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}
//toggleTodo action creator
function toggleTodoAC(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}
//addGoal action creator
function addGoalAC(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}
//removeGoal action creator
function removeGoalAC(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}
//redux middleware
const check = (store) => (next) => (action) => {
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    alert("NO BITCOIN");
    return;
  } else if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    alert("NO BITCOIN");
    return;
  }
  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("previous state", store.getState());
  const result = next(action);
  console.log("current state", store.getState());
  console.groupEnd();
  return result;
};
//using the store
const store = Redux.createStore(
  Redux.combineReducers({ todos, goals }),
  Redux.applyMiddleware(check, logger)
);
/* ****************************************************************** */
// UI stuff
function createTodo(todo) {
  const listItem = document.createElement("li");
  const itemStatus = document.createElement("p");
  const itemText = document.createElement("p");

  itemStatus.innerHTML = todo.complete ? "&check;" : "&Chi;";
  itemStatus.classList.add("todo-item_status");
  itemText.innerText = todo.name;
  listItem.append(itemStatus, itemText);

  itemText.addEventListener("click", () => {
    store.dispatch(removeTodoAC(todo.id));
  });

  itemStatus.addEventListener("click", () => {
    store.dispatch(toggleTodoAC(todo.id));
  });

  return listItem;
}

function createGoal(goal) {
  const goalItem = document.createElement("li");
  const goalText = document.createElement("p");

  goalText.innerText = goal.name;
  goalItem.append(goalText);

  goalText.addEventListener("click", () => {
    store.dispatch(removeGoalAC(goal.id));
  });

  return goalItem;
}

const updateUI = () => {
  const allTodos = document.querySelector(".todos-list");
  const allGoals = document.querySelector(".goals-list");
  const todoSection = document.querySelector(".todo");
  const goalsSection = document.querySelector(".goal");

  allTodos.innerHTML = "";
  allGoals.innerHTML = "";

  const { todos, goals } = store.getState();

  todos.forEach((todo) => {
    const todoElem = createTodo(todo);
    allTodos.append(todoElem);
  });

  goals.forEach((goal) => {
    const goalsElem = createGoal(goal);
    allGoals.append(goalsElem);
  });

  todoSection.append(allTodos);
  goalsSection.append(allGoals);
};

store.subscribe(updateUI);

const addTodoBtn = document.querySelector(".todo-add_button");
const addGoalBtn = document.querySelector(".add-goal_button");

addTodoBtn.addEventListener("click", () => {
  const addTodoInput = document.querySelector("#todo-add_input");
  store.dispatch(
    addTodoAC({
      id: new Date().getTime(),
      complete: false,
      name: addTodoInput.value,
    })
  );
  addTodoInput.value = "";
});

addGoalBtn.addEventListener("click", () => {
  const addGoalInput = document.querySelector("#add-goal_input");
  store.dispatch(
    addGoalAC({
      id: new Date().getTime(),
      name: addGoalInput.value,
    })
  );
  addGoalInput.value = "";
});
/* ****************************************************************** */
// React stuff
function handleTodoSubmit(inputVal) {
  store.dispatch(
    addTodoAC({
      id: new Date().getTime(),
      complete: false,
      name: inputVal,
    })
  );
}

function handleGoalSubmit(inputVal) {
  store.dispatch(
    addGoalAC({
      id: new Date().getTime(),
      name: inputVal,
    })
  );
}

function ReactTodo() {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <section className="todo">
      <header>react things to do!</header>
      <form
        className="todo-add"
        onSubmit={(e) => {
          e.preventDefault();
          handleTodoSubmit(inputValue);
          setInputValue("");
        }}>
        <label htmlFor="react-todo_input">Add Todo</label>
        <input
          id="react-todo_input"
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todos-list"></ul>
    </section>
  );
}

function ReactGoal() {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <section className="goal">
      <header>react goals to achive!</header>
      <form
        className="goal-add"
        onSubmit={(e) => {
          e.preventDefault();
          handleGoalSubmit(inputValue);
          setInputValue("");
        }}>
        <label htmlFor="react-goal_input">Add goal</label>
        <input
          id="react-goal_input"
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button type="submit">Add</button>
      </form>
      <ul className="goals-list"></ul>
    </section>
  );
}

function App() {
  return (
    <div>
      <ReactTodo />
      <ReactGoal />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
