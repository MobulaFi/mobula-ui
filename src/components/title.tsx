import React from "react";
import { cn } from "../lib/shadcn/lib/utils";
import { MediumFont } from "./fonts";
import { Skeleton } from "./skeleton";

interface TitleContainerProps {
  title?: React.ReactNode;
  children: JSX.Element[] | JSX.Element;
  isLoading?: boolean;
  extraCss?: string;
}

export const TitleContainer = ({
  children,
  title,
  isLoading,
  extraCss,
}: TitleContainerProps) => {
  //   const {fontMain} = useContext(ColorsContext);
  return (
    <div
      className={cn(
        "w-full flex items-center h-[40px] rounded-t-2xl bg-light-bg-terciary dark:bg-dark-bg-terciary relative p-2.5 lg:py-2.5 md:p-2.5 border-b border-light-border-primary dark:border-dark-border-primary",
        extraCss
      )}
    >
      {isLoading ? (
        <Skeleton extraCss="w-[100px] h-[30px]" />
      ) : (
        <MediumFont
          extraCss="whitespace-nowrap font-medium"
          //   color={fontMain || text80}
        >
          {title}
        </MediumFont>
      )}

      {children}
    </div>
  );
};
