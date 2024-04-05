const getMetaData = (startDate) => {
  const currentDate = new Date();
  const differenceInMilliSec = currentDate.getTime() - startDate.getTime();
  const differenceInSeconds = differenceInMilliSec / 1000;
  const differenceInMinutes = differenceInSeconds / 60;
  const differenceInHours = differenceInMinutes / 60;
  const differenceInDays = differenceInHours / 24;

  const d = startDate.toString().split(" ");
  // viewed more than a year after
  if (differenceInDays >= 365) {
    // <Month><day>,<year> at <hh:min>
    return d[1] + " " + d[2] + ", " + d[3] + " at " + d[4].substr(0, 5);
  }

  // viewed after more than 24 hours
  if (differenceInHours >= 24) {
    // <Month><day> at <hh:min>
    return d[1] + " " + d[2] + " at " + d[4].substr(0, 5);
  }

  // viewed after less than 24 hours but more than 59 minutes
  if (differenceInHours < 24 && differenceInHours >= 1) {
    // 2 hours ago
    return "" + Math.round(differenceInHours) + " hours ago";
  }

  // viewed after a few minutes
  if (differenceInMinutes >= 1) {
    // 5 minutes ago
    return "" + Math.round(differenceInMinutes) + " minutes ago";
  }

  // 36 seconds ago
  return "" + Math.round(differenceInSeconds) + " seconds ago";
};

export { getMetaData };
