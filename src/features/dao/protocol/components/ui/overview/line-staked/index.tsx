import React from "react";
import { cn } from "../../../../../../../lib/shadcn/lib/utils";

interface StakedLineProps {
  title: string;
  value: string;
  icon: any;
  extraCss?: string;
}

export const StakedLine = ({
  title,
  value,
  icon,
  extraCss,
}: StakedLineProps) => {
  return (
    <div className={cn("flex items-center mb-2.5", extraCss)}>
      {icon}
      <p className="text-sm text-light-font-60 dark:text-dark-font-60">
        {" "}
        {title}
        <span className="ml-[5px] text-light-font-100 dark:text-dark-font-100">
          {value}
        </span>
      </p>
    </div>
  );
};
