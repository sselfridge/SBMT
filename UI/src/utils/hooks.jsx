import React from "react";
import { DateTime } from "luxon";
import AppContext from "AppContext";

export const useIsOffSeason = () => {
  const { endingDate, kickOffDate } = React.useContext(AppContext);

  const endDate = DateTime.fromISO(endingDate).plus({ weeks: 1 });
  const startDate = DateTime.fromISO(kickOffDate);
  const isPostSeason = endDate < DateTime.now();
  const isPreSeason = DateTime.now() < startDate;

  return isPostSeason || isPreSeason;
};
