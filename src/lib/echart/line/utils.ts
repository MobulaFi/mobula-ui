import { TimeSelected } from "../../../interfaces/pages/asset";

export const getTimeStampFromTimeFrame = (timeFrame: TimeSelected) => {
  switch (timeFrame) {
    case "24H":
      return 24 * 60 * 60 * 1000;
    case "7D":
      return 7 * 24 * 60 * 60 * 1000;
    case "30D":
      return 30 * 24 * 60 * 60 * 1000;
    case "3M":
      return 3 * 30 * 24 * 60 * 60 * 1000;
    case "1Y":
      return 365 * 24 * 60 * 60 * 1000;
    case "ALL":
      return Infinity;
    default:
      return 24 * 60 * 60 * 1000;
  }
};
