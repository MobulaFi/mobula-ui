import React from "react";
import { SmallFont } from "../../../../components/fonts";
import { cn } from "../../../../lib/shadcn/lib/utils";

interface LinesProps {
  title: string;
  extraCss?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const Lines = ({ title, extraCss, children, ...props }: LinesProps) => {
  return (
    <div className={cn("flex justify-between pb-2.5", extraCss)} {...props}>
      <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
        {title}
      </SmallFont>
      {children}
    </div>
  );
};
