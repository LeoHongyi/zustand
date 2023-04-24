import { createStore } from './vanilla';
import { useSyncExternalStore, useRef, useCallback,useState, useEffect } from 'react';

function useMySyncExternalStor(subscribe, getSnapshot) {
  const [state, setState] = useState(getSnapshot());
  useEffect(()=>{
    return subscribe((nextSnapshot)=>{
      setState(nextSnapshot)
    })
  }, [])
  return state
}

export function useStore(api, selector) {
    const lastSnapshotRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const getSelection = useCallback(() => {
        let lastSelection = lastSelectionRef.current;
        if (lastSelection === null) {
            const nextSnapShot = api.getState();
            lastSelection = selector(nextSnapShot);
            lastSnapshotRef.current = nextSnapShot;
            lastSelectionRef.current = lastSelection;
            return lastSelection;
        }
        const lastSnapshot = lastSnapshotRef.current;
        const nextSnapShot = api.getState();
        if (Object.is(lastSnapshot, nextSnapShot)) {
            return lastSelection;
        }
        const nextSelection = selector(nextSnapShot);
        lastSnapshotRef.current = nextSnapShot;
        lastSelectionRef.current = nextSelection;
        return nextSelection;
    }, []);
    // use useSyncExternalStore get
    let value = useMySyncExternalStor(api.subscribe, getSelection);
    return value;
}
export const create = (createState) => {
  //create a repo
  const api = createStore(createState);
  //return a hook and get new state via useStore
  return (selector) => useStore(api, selector);
}


export default create
