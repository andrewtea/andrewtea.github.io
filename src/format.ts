// Post dates in the forum's lowercase style, such as "nov 11, 2026". Dates are calendar days, so read them in UTC.
export const postDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).toLowerCase();
