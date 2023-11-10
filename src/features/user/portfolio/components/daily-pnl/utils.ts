export const formatDateByTimeframe = (date: number, timeframe: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Add this line to switch to a 24-hour format
  };

  switch (timeframe) {
    case "24H":
      // Display hours and minutes
      return new Intl.DateTimeFormat("en-US", options).format(date);
    case "24H":
      return new Intl.DateTimeFormat("en-US", options).format(date);
    case "7D":
      // Display the day of the week
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(date);
    case "30D":
      // Display the day of the month (Apr 15 for ex)
      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(date);
    case "1Y":
      // Display only the month and year
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
      }).format(date);
    default:
      // Return the full date as a fallback
      return new Intl.DateTimeFormat("en-US").format(date);
  }
};
