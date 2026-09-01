import { YEARS } from "utils/constants";
import type { User } from "./types/StravaUserDTO";

export type AppState = {
  user: User | null;
  isPreSeason: boolean;
  isPostSeason: boolean;
  isOffSeason: boolean;
  rateLimit: number;
  env: string;
  kickOffDate: string;
  endingDate: string;
  year: string | null;
};

type Action =
  | { type: "setUser"; user: User }
  | { type: "setSettings"; settings: Partial<AppState> }
  | { type: "setYear"; year: string };

export default function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user };
    // case "setRateLimit":
    //   return { ...state, rateLimit: action.rateLimit };
    case "setSettings":
      return { ...state, ...action.settings };
    case "setYear":
      if (YEARS.includes(action.year) === false) {
        console.error("Invalid Year", action.year);
        return state;
      }
      return { ...state, year: action.year };

    default:
      throw new Error();
  }
}

const { search } = window.location;
const params = new URLSearchParams(search);
let year = params.get("year");
if (YEARS.includes(year as string) === false) {
  // eslint-disable-next-line prefer-destructuring
  year = YEARS[0];
}

export const INITIAL_STATE = {
  user: null,
  isPreSeason: false,
  isPostSeason: false,
  isOffSeason: false,
  rateLimit: -1,
  env: "Production",
  kickOffDate: "",
  endingDate: "",
  year,
  siteReady: false,
};
