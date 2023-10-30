import React from "react";
import { PiDotsNineBold } from "react-icons/pi";

interface ActiveFiltersProps {
  name: string;
  [key: string]: any;
}

export const ActiveFilters = ({ name, ...props }: ActiveFiltersProps) => {
  return (
    <div
      className="flex items-center px-2.5 sm:px-[7.5px] mr-[7.5px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-full h-[30px] sm:h-[25px] mt-[7.5px] border border-light-border-primary dark:border-dark-border-primary text-sm sm:text-xs text-light-font-100 dark:text-dark-font-100 cursor-pointer"
      {...props}
    >
      <PiDotsNineBold className="mr-[7.5px]" />
      {name}
    </div>
  );
};
