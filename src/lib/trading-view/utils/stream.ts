export const getNextBarTime = (resolution: string, time: number) => {
  const date = new Date(time);
  const utcDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );

  switch (resolution) {
    case "1":
    case "3":
    case "5":
    case "15":
      utcDate.setMinutes(utcDate.getMinutes() + 1);
      break;
    case "60":
    case "120":
    case "240":
    case "360":
    case "720":
    case "D":
      utcDate.setHours(utcDate.getHours() + 1);
      break;
    case "W":
      utcDate.setDate(utcDate.getDate() + 7);
      break;
    case "M":
      utcDate.setMonth(utcDate.getMonth() + 1);
      break;
  }

  return Math.floor(utcDate.getTime());
};
