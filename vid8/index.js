const actions = [
  {
    type: "ADD_TODO",
    todo: {
      id: 0,
      name: "Learn Redux",
      complete: false,
    },
  },

  {
    type: "REMOVE_TODO",
    id: 0,
  },

  {
    type: "TOGGLE_TODO",
    id: 0,
  },

  {
    type: "ADD_GOAL",
    goal: {
      id: 0,
      name: "Run a Marathon",
    },
  },

  {
    type: "REMOVE_GOAL",
    id: 0,
  },
];
// The actions was created beacause of prettier
function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.todo]);
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.id);
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

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
