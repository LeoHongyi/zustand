
const logger = (createState) => {
  return (set, get, api) => {
    return createState((...args) => {
      console.log('before set', get());
      set(...args);
      console.log('after set', get());
    }, get, api)
  }
}
export default logger;
