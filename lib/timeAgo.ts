const timeAgo = (date: string): string => {
  let dateObj: Date;
  try {
    dateObj = new Date(date);
  } catch (e) {
    return "";
  }

  let relativeString: string;

  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (years > 0) {
    relativeString = rtf.format(0 - years, "year");
  } else if (months > 0) {
    relativeString = rtf.format(0 - months, "month");
  } else if (days > 0) {
    relativeString = rtf.format(0 - days, "day");
  } else if (hours > 0) {
    relativeString = rtf.format(0 - hours, "hour");
  } else if (minutes > 0) {
    relativeString = rtf.format(0 - minutes, "minute");
  } else if (seconds > 10) {
    relativeString = rtf.format(0 - seconds, "second");
  } else {
    relativeString = "just now";
  }

  return relativeString;
};

export default timeAgo;
