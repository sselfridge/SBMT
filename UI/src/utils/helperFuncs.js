import { intervalToDuration, format, parseISO, formatDistance } from "date-fns";
import debug from "debug";

export const db = debug("root");
db("db Init!");
export function formattedTime(seconds, showHours = false) {
  const out = intervalToDuration({ start: 0, end: seconds * 1000 });
  out.seconds = out.seconds || 0;
  out.minutes = out.minutes || 0;
  out.hours = out.hours || 0;
  let str = "";
  if (out.hours || showHours) str += `${out.hours}:`.padStart(3, 0);
  str += `${out.minutes}:`.padStart(3, 0);
  str += `${out.seconds}`.padStart(2, 0);
  return str;
}

export function formattedDate(dateString) {
  try {
    const date = parseISO(dateString);
    const formatted = format(date, "MM/dd - hh:mm a");
    return formatted;
  } catch (error) {
    return "";
  }
}

export function formattedTimeAgo(dateString) {
  const date = parseISO(dateString);
  const string = formatDistance(date, new Date());
  return `${string} ago`;
}

export const deepFreeze = (obj1) => {
  Object.keys(obj1).forEach((property) => {
    if (typeof obj1[property] === "object" && !Object.isFrozen(obj1[property]))
      deepFreeze(obj1[property]);
  });
  return Object.freeze(obj1);
};

export const metersToMiles = (meters) => {
  return (meters * 0.000621371).toFixed(2);
};

export const metersToFeet = (meters) => {
  return Math.floor(meters * 3.28084).toLocaleString();
};
