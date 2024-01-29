import React from "react";
import { SmallFont } from "../../../../../../components/fonts";

interface LinesProps {
  title: string;
  value: number | string | React.ReactNode;
  odd?: boolean;
}

export const Lines = ({ title, value, odd }: LinesProps) => {
  return (
    <div
      className={`flex justify-between items-center w-2/4 md:w-full py-2.5 px-[15px]
     border-b border-light-border-primary dark:border-dark-border-primary ${
       odd ? "border-r" : ""
     }`}
    >
      <SmallFont>{title}</SmallFont>
      <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
        {value}
      </SmallFont>
    </div>
  );
};
