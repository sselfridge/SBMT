import { differenceInSeconds } from "date-fns";

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

const launchDate = "05-24-2024";
export const INITIAL_STATE = {
  user: null,
  launchDate,
  endDate: "09-02-2024",
  isPreLaunch: differenceInSeconds(launchDate, new Date()) > 0,
  rateLimit: -1,
};
