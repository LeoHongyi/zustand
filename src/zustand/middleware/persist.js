export function createJSONStorage(storage) {
  return {
    getItem(name) {
      const str = storage.getItem(name)
      return str ? JSON.parse(str) : {};
    },
    setItem(name, newValue) {
      storage.setItem(name, JSON.stringify(newValue));
    }
  }
}

export const persist = (createState, {name, storage}) => {
 return (set, get, api) => {
    //override getState
    let result = createState((...args) => {
      //call original setState
      set(...args);
      //store the new state to storage
      storage.setItem(name, get());
    }, get, api);
    //get the state from storage
    queueMicrotask(() => {
      set(storage.getItem(name));
    });
    return result;
  }
}
