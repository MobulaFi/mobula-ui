import React from "react";

interface TimeBoxProps {
  timeframe: string;
  number: number;
  inside?: boolean;
}

export const TimeBox = ({
  timeframe,
  number,
  inside = false,
}: TimeBoxProps) => {
  return (
    <div
      className={`flex flex-col items-center ${
        timeframe === "Sec" ? "" : "mr-2.5"
      }`}
    >
      <div
        className="flex items-center w-[50px] h-[40px] md:h-[35px] rounded-md justify-center
       text-light-font-100 dark:text-dark-font-100 font-medium bg-light-bg-terciary
        dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary"
      >
        {number || "00"} {inside && timeframe[0]}
      </div>
      {!inside && (
        <p className="mt-[5px] text-light-font-40 dark:text-dark-font-40 text-xs">
          {timeframe}
        </p>
      )}
    </div>
  );
};
