export const START_DATE = new Date("2023-05-26T01:00:00-07:00");

export const APP_ATHLETE_ID = 1;

export const surfaceList = ["ALL", "road", "gravel"];
export const genderList = ["ALL", "M", "F"];
export const categoryList = [
  "ALL",
  "Pro",
  "Cat 1/2 (Expert)",
  "Cat 3 (Advanced)",
  "Cat 4 (Intermediate)",
  "Cat 5 (Beginner)",
  "None",
];
export const ageList = [
  "ALL",
  "19 and under",
  "20 to 24",
  "25 to 34",
  "35 to 44",
  "45 to 54",
  "55 to 64",
  "65 to 69",
  "70 to 74",
  "75 and over",
];

export const weightClass = [
  "ALL",
  "124lbs and under",
  "125lbs to 149lbs",
  "150lbs to 164lbs",
  "165lbs to 179lbs",
  "180lbs to 199lbs",
  "200lbs to 224lbs",
  "225lbs to 249lbs",
  "250lbs and over",
];

export const distanceList = [
  "ALL",
  "10 mi/wk",
  "20 mi/wk",
  "30 mi/wk",
  "50 mi/wk",
];
export const elevationList = [
  "ALL",
  "1k ft/wk",
  "2k ft/wk",
  "5k ft/wk",
  "10k ft/wk",
];

export const MOBILE_COLUMNS = {
  rank: true,
  athlete: true,
  completedDesktop: false,
  completedMobile: true,
  totalDistance: false,
  totalElevation: false,
  totalTimeDesktop: false,
  totalTimeMobile: true,
};
export const ALL_COLUMNS = {
  rank: true,
  athlete: true,
  completedDesktop: true,
  completedMobile: false,
  totalDistance: true,
  totalElevation: true,
  totalTimeDesktop: true,
  totalTimeMobile: false,
};

export const MAX_INT = 2147483647;
