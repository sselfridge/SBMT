import { intervalToDuration } from "date-fns";

export function formattedTime(seconds, showHours = false) {
  const out = intervalToDuration({ start: 0, end: seconds * 1000 });
  let str = "";
  if (out.hours || showHours) str += `${out.hours}:`.padStart(3, 0);
  str += `${out.minutes}:`.padStart(3, 0);
  str += `${out.seconds}`.padStart(2, 0);
  return str;
}

export const deepFreeze = (obj1) => {
  Object.keys(obj1).forEach((property) => {
    if (typeof obj1[property] === "object" && !Object.isFrozen(obj1[property]))
      deepFreeze(obj1[property]);
  });
  return Object.freeze(obj1);
};
