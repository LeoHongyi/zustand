import { create } from './zustand';
import logger from './zustand/middleware/logger';
import {persist, createJSONStorage} from './zustand/middleware/persist'
import {immer} from './zustand/middleware/immer'

// const useStore = create(() => {
//   return {
//     number: 0,
//     name: 'Number',
//     add: () => console.log('add'),
//     minus: () => console.log('minus'),
//   }
// })

const createState = (set) => {
  return {
    number: 0,
    name: 'Number',
    add: () => set(state => { state.number += 1 }),
    minus: () => set(state => { state.number -= 1 }),
    asyncAdd: () => setTimeout(() => set(state => ({ number: state.number + 1 })), 1000),
    asyncMinus: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({ number: state.number - 1 }))
    }
  }
}
//createState passed to create() is a function that returns an object
//create repo like state management return a hook and get new state via useStore
// const useStore = create(persist(createStore, {
//   name: 'counter',
//   storage: createJSONStorage(sessionStorage),
// }));
const useStore = create(immer(createState))

function App() {
  useStore(state => console.log(state))
    const { number, name, add, minus, asyncAdd } = useStore(state => (
        {
            name: state.name,
            number: state.number,
            add: state.add,
            minus: state.minus,
            asyncAdd: state.asyncAdd
        }));
    console.log(name)
  return (
    <div className="App">
      <p>{name}: {number}</p>
      <button onClick={add}>+</button>
      <button onClick={minus}>-</button>
      <button onClick={asyncAdd}>async</button>
      {/* <button onClick={asyncMinus}>asyncMinus</button>*/}
    </div>
  );
}

export default App;
