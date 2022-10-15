export default function reducer(state, action) {
  console.info("action: ", action);
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user };
    default:
      throw new Error();
  }
}
