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
      if (YEARS.includes(year) === false) {
        console.error("Invalid Year", year);
        break;
      }
      return { ...state, year: action.year };

    default:
      throw new Error();
  }
}

const { search } = window.location;
const params = new URLSearchParams(search);
let year = params.get("year");
if (YEARS.includes(year) === false) {
  // eslint-disable-next-line prefer-destructuring
  year = YEARS[0];
}

export const INITIAL_STATE = {
  user: null,
  isPreLaunch: false,
  rateLimit: -1,
  env: "Production",
  kickOffDate: "",
  endingDate: "",
  year,
};
