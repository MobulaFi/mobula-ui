import { useContext } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { Skeleton } from "../../../../../../components/skeleton";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { calculateDaysRemaining } from "../../../../utils";

export const CalendarEvent = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  const fakeArr = [
    [1630483200000, 1000000, { "1%": 10000 }],
    [1630483200000, 1000000, { "1%": 10000 }],
    [1630483200000, 1000000, { "1%": 10000 }],
    [1630483200000, 1000000, { "1%": 10000 }],
    [1630483200000, 1000000, { "1%": 10000 }],
  ];

  const getNextEvents = () => {
    const now = new Date().getTime();
    const nextEvent = baseAsset?.release_schedule?.filter(
      (entry) => entry.unlock_date >= now
    );
    const newEvents = nextEvent?.filter((_, i) => i < 7);
    if (newEvents?.length > 0) return newEvents;
    const prevEvents = baseAsset?.release_schedule?.filter(
      (entry) => entry.unlock_date <= now
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

      {baseAsset?.release_schedule?.length > 0 ? (
        <>
          {sevenNextEvents?.map(
            ({ unlock_date, tokens_to_unlock, allocation_details }) => {
              const { day, month, year } = getDate(unlock_date);
              const daysRemaining = calculateDaysRemaining(unlock_date);
              const name = allocation_details
                ? Object.keys(allocation_details)[0]
                : null;
              const percentage = allocation_details
                ? Object.values(allocation_details)[0]
                : null;
              const percentageOfSupply =
                ((percentage as number) * 100) / (baseAsset.total_supply || 0);
              const formattedPercentage = (percentage) =>
                percentage.toString().includes("00")
                  ? percentage.toFixed(3)
                  : percentage.toFixed(2);
              const percentageOfSupplyFormatted =
                formattedPercentage(percentageOfSupply);
              const amountInPrice = tokens_to_unlock * (baseAsset?.price || 0);
              const percentageOfMC = formattedPercentage(
                (amountInPrice * 100) / (baseAsset?.market_cap || 0)
              );
              const dayLeftText = getTextFromDayLeft(daysRemaining);

              return (
                <div
                  key={unlock_date}
                  className="flex flex-col py-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary"
                >
                  <div className="flex items-center">
                    <div
                      className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-md flex-col 
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
                          Unlock of {getFormattedAmount(percentage as number)}{" "}
                          {baseAsset?.symbol} - {percentageOfSupplyFormatted}%
                          of Total Supply
                        </MediumFont>
                        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                          {" "}
                          ${getFormattedAmount(amountInPrice)} ({percentageOfMC}
                          % of M.Cap)
                        </SmallFont>

                        <div
                          className="flex items-center h-[26px] md:h-[22px] bg-light-bg-hover dark:bg-dark-bg-hover 
                      px-2 rounded-full w-fit text-xs font-medium mt-2.5 text-light-font-100 dark:text-dark-font-100"
                        >
                          {name}
                        </div>
                      </div>

                      <MediumFont extraCss="text-end mr-2.5 font-medium">
                        {dayLeftText}
                      </MediumFont>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </>
      ) : (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col py-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary"
            >
              <div className="flex items-center">
                <div
                  className="flex bg-light-bg-hover dark:bg-dark-bg-hover rounded-md flex-col 
   justify-center items-center py-2.5 min-w-[80px] md:min-w-[60px] min-h-[80px] md:min-h-[60px]"
                >
                  <Skeleton extraCss="h-[14px] md:h-[12px] w-[45px] mb-1" />
                  <Skeleton extraCss="h-[16px] md:h-[14px] w-[25px]" />
                  <Skeleton extraCss="h-[14px] md:h-[12px] w-[55px] mt-1" />
                </div>
                <div className="flex ml-5 md:ml-2.5 justify-between h-full w-full items-center">
                  <div className="flex flex-col">
                    <Skeleton extraCss="h-[16px] md:h-[14px] w-[280px] md:w-[150px] mb-1.5" />
                    <Skeleton extraCss="h-[14px] md:h-[12px] w-[120px]" />
                    <Skeleton extraCss="h-[22px] md:h-[18px] rounded-full mt-1.5 w-[90px] md:w-[75px]" />
                  </div>
                  <Skeleton extraCss="h-[16px] md:h-[14px] w-[120px] md:w-[80px]" />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};
