import React, { useContext } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { calculateDaysRemaining } from "../../../../utils";

export const CalendarEvent = () => {
  const { baseAsset } = useContext(BaseAssetContext);

  const getNextEvents = () => {
    const now = new Date().getTime();
    const nextEvent = baseAsset?.release_schedule?.filter(
      (entry) => entry[0] >= now
    );
    const newEvents = nextEvent?.filter((_, i) => i < 7);
    if (newEvents?.length > 0) return newEvents;
    const prevEvents = baseAsset?.release_schedule?.filter(
      (entry) => entry[0] <= now
    );
    return prevEvents;
  };

  const getDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return { day, month, year };
  };

  const sevenNextEvents = getNextEvents();

  const getTextFromDayLeft = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`;
    if (daysLeft < 1) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days left`;
  };

  return (
    <>
      <LargeFont extraCss="mt-[25px] mb-5">Unlocking Events</LargeFont>
      {sevenNextEvents?.map(([timestamp, value, type]) => {
        const { day, month, year } = getDate(timestamp);
        const daysRemaining = calculateDaysRemaining(timestamp);
        const key = Object.keys(type)[0];
        const typeValue = Object.values(type)[0];
        const percentageOfSupply =
          ((typeValue as number) * 100) / (baseAsset.total_supply || 0);
        const formattedPercentage = (percentage) =>
          percentage.toString().includes("00")
            ? percentage.toFixed(3)
            : percentage.toFixed(2);
        const percentageOfSupplyFormatted =
          formattedPercentage(percentageOfSupply);
        const amountInPrice = value * (baseAsset?.price || 0);
        const percentageOfMC = formattedPercentage(
          (amountInPrice * 100) / (baseAsset?.market_cap || 0)
        );
        const dayLeftText = getTextFromDayLeft(daysRemaining);
        return (
          <div
            key={timestamp}
            className="flex flex-col py-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary"
          >
            <div className="flex items-center">
              <div
                className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded flex-col 
              justify-center items-center py-2.5 min-w-[80px] md:min-w-[60px] min-h-[80px] md:min-h-[60px]"
              >
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                  {month}
                </SmallFont>
                <MediumFont extraCss="font-bold">{day}</MediumFont>
                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                  {year}
                </SmallFont>
              </div>
              <div className="flex ml-5 md:ml-2.5 justify-between h-full w-full items-center">
                <div className="flex flex-col">
                  <MediumFont>
                    Unlock of {getFormattedAmount(typeValue as number)}{" "}
                    {baseAsset?.symbol} - {percentageOfSupplyFormatted}% of
                    Total Supply
                  </MediumFont>
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                    {" "}
                    ${getFormattedAmount(amountInPrice)} ({percentageOfMC}% of
                    M.Cap)
                  </SmallFont>

                  <div
                    className="flex items-center h-[26px] md:h-[22px] bg-light-bg-hover dark:bg-dark-bg-hover 
                  px-2 rounded-full w-fit text-xs font-medium mt-2.5 text-light-font-100 dark:text-dark-font-100"
                  >
                    {key}
                  </div>
                </div>
                <MediumFont extraCss="text-end mr-2.5 font-medium">
                  {dayLeftText}
                </MediumFont>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
