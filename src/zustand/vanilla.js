//receive a initialize state function, return

export const createStore = (createState) => {
   let state;
   let listeners = new Set();
   //get state function
   const getState = () => state;
    //set state function
    const setState = (partial) => {
      const nextState = typeof partial === 'function' ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        let previousState = state
        state = Object.assign({}, previousState, nextState);
        listeners.forEach(listener => listener(state, previousState));
      }
    }
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
   // create a repo
    const api = {
      getState,
      setState,
      subscribe
    };
    //call createState to get a initialize state assign to state
    state = createState(setState, getState, api);
    return api;
}

export default createStore;
