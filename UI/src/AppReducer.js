import { differenceInSeconds } from "date-fns";
import { YEARS } from "utils/constants";
export default function reducer(state, action) {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user };
    // case "setRateLimit":
    //   return { ...state, rateLimit: action.rateLimit };
    case "setSettings":
      const { kickOffDate } = action.settings;

      const isPreLaunch = differenceInSeconds(kickOffDate, new Date()) > 0;

      return { ...state, isPreLaunch, ...action.settings };
    case "setYear":
      return { ...state, year: action.year };
    default:
      throw new Error();
  }
}

const { search } = window.location;
const urlParams = new URLSearchParams(search);
export const INITIAL_STATE = {
  user: null,
  isPreLaunch: true,
  rateLimit: -1,
  env: "Production",
  kickOffDate: "",
  endingDate: "",
  year: urlParams.get("year") || YEARS[0],
};
