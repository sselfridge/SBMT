export default function reducer(state, action) {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user };
    // case "setRateLimit":
    //   return { ...state, rateLimit: action.rateLimit };
    default:
      throw new Error();
  }
}

export const INITIAL_STATE = {
  user: null,
  rateLimit: -1,
};
