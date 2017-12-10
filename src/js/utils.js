export const getHumanReadableTime = (timeString) => {
  let date = new Date(timeString);
  return date.toDateString();
}
