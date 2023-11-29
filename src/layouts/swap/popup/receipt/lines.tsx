import React from "react";
import { MediumFont } from "../../../../components/fonts";
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
      <MediumFont>{title}</MediumFont>
      {children}
    </div>
  );
};
