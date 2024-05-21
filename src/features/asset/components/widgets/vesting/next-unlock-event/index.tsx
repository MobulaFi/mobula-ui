import { getFormattedAmount } from "@utils/formaters";
import { LargeFont, MediumFont, SmallFont } from "components/fonts";
import React, { useCallback, useContext, useEffect } from "react";
import { BaseAssetContext } from "../../../../context-manager";

export const NextUnlockEvent = () => {
  const { baseAsset, setTimeRemaining, timeRemaining } =
    useContext(BaseAssetContext);

  const getNextUnlock = useCallback(() => {
    const now = new Date().getTime();

    const sortedSchedule = baseAsset?.release_schedule?.sort(
      (a, b) => a.unlock_date - b.unlock_date
    );

    const nextEvent = sortedSchedule.find((entry) => entry.unlock_date > now);

    if (nextEvent) {
      return {
        totalAmount: nextEvent.tokens_to_unlock,
        date: nextEvent.unlock_date,
        percentageOfSupply: (
          (nextEvent.tokens_to_unlock / (baseAsset?.total_supply || 1)) *
          100
        ).toFixed(3),
      };
    }
    return {
      totalAmount: 0,
      date: null,
      percentageOfSupply: 0,
    };
  }, [baseAsset?.release_schedule, baseAsset?.total_supply]);

  const { totalAmount, date, percentageOfSupply } = getNextUnlock();
  const timeBoxStyle =
    "flex items-center justify-center w-[57.5px] h-[50px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-lg mb-[5px] font-medium text-sm";

  const getPercentageFromMarketCap = () => {
    const amountUSD = totalAmount * (baseAsset?.price || 0);
    const percentage = (100 / (baseAsset?.market_cap || 1)) * amountUSD;
    return percentage.toFixed(2);
  };

  const percentageOfMC = getPercentageFromMarketCap();
  const getZero = (number: number) => (number < 10 ? `0${number}` : number);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const timeDifference = date - now;

      if (timeDifference <= 0) {
        clearInterval(intervalId);
      } else {
        const days = getZero(
          Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        );
        const hours = getZero(
          Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
        );
        const minutes = getZero(
          Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
        );
        const seconds = getZero(
          Math.floor((timeDifference % (1000 * 60)) / 1000)
        );

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  if (date)
    return (
      <div
        className="p-5 rounded-2xl border border-light-border-primary dark:border-dark-border-primary 
      bg-light-bg-secondary dark:bg-dark-bg-secondary mb-2.5 w-full mx-auto mt-0 lg:mt-2.5 flex-col"
      >
        <div className="flex flex-col">
          <div className="flex flex-col">
            <LargeFont extraCss="text-left lg:text-center">
              Next Unlock Event
            </LargeFont>
          </div>
          <div className="flex items-center w-full justify-between max-w-[300px] mx-auto mt-[15px]">
            <div className="flex flex-col">
              <div className={timeBoxStyle}>{timeRemaining.days}</div>
              <p className="text-center text-xs lg:text-[11px] md:text-[10px] text-light-font-100 dark:text-dark-font-100">
                Days
              </p>
            </div>
            <div className="flex flex-col">
              <div className={timeBoxStyle}>{timeRemaining.hours}</div>
              <p className="text-center text-xs lg:text-[11px] md:text-[10px] text-light-font-100 dark:text-dark-font-100">
                Hours
              </p>
            </div>
            <div className="flex flex-col">
              <div className={timeBoxStyle}>{timeRemaining.minutes}</div>
              <p className="text-center text-xs lg:text-[11px] md:text-[10px] text-light-font-100 dark:text-dark-font-100">
                Min
              </p>
            </div>
            <div className="flex flex-col">
              <div className={timeBoxStyle}>{timeRemaining.seconds}</div>
              <p className="text-center text-xs lg:text-[11px] md:text-[10px] text-light-font-100 dark:text-dark-font-100">
                Sec
              </p>
            </div>
          </div>
        </div>
        <MediumFont extraCss="mt-2.5 text-left lg:text-center">
          Unlock of {getFormattedAmount(totalAmount)} {baseAsset?.symbol} (
          {percentageOfSupply}% of Total Supply)
        </MediumFont>
        <SmallFont extraCss="mt-[5px] text-left lg:text-center text-light-font-60 dark:text-dark-font-60">
          ${getFormattedAmount(totalAmount * (baseAsset?.price || 0))} (
          {percentageOfMC}% of M.Cap)
        </SmallFont>
        <button
          className="flex items-center justify-center bg-light-bg-hover dark:bg-dark-bg-hover w-full h-[40px] rounded-md mt-5 text-light-font-100 
        dark:text-dark-font-100 font-medium border border-light-border-primary dark:border-dark-border-primary 
        max-w-[300px] md:max-w-full mx-auto opacity-50 cursor-not-allowed"
          disabled
        >
          Set an alert for this event
        </button>
      </div>
    );
  return null;
};
