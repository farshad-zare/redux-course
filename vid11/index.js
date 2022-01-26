//store code
function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => {
        l !== listener;
      });
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}
/* **************************************************************** */
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

//todo reduer
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
//all reducers combined
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
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

//using the store
const store = createStore(app);

const removeConsleLog = store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(
  addGoalAC({
    id: 0,
    name: "Run a Marathon",
  })
);

store.dispatch(
  addTodoAC({
    id: 0,
    name: "Learn Redux",
    complete: false,
  })
);

store.dispatch(
  addTodoAC({
    id: 1,
    name: "Learn Nuxt",
    complete: false,
  })
);

store.dispatch(
  addGoalAC({
    id: 1,
    name: "Build a House",
  })
);

store.dispatch(toggleTodoAC(1));
store.dispatch(removeTodoAC(0));
store.dispatch(removeGoalAC(0));
removeConsleLog();

setTimeout(() => {
  console.log(store.getState());
}, 2000);
