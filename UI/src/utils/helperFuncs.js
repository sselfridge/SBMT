import { intervalToDuration } from "date-fns";

export function formattedTime(seconds, showHours = false) {
  const out = intervalToDuration({ start: 0, end: seconds * 1000 });
  let str = "";
  if (out.hours || showHours) str += `${out.hours}:`.padStart(3, 0);
  str += `${out.minutes}:`.padStart(3, 0);
  str += `${out.seconds}`.padStart(2, 0);
  return str;
}
