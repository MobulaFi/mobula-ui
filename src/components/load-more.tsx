import React from "react";
import { cn } from "../lib/shadcn/lib/utils";
import { SmallFont } from "./fonts";
import { Spinner } from "./spinner";

interface LoadMoreProps {
  callback: () => void;
  isLoading: boolean;
  count?: number;
  totalCount?: number | boolean;
  extraCss?: string;
}

export const LoadMore = ({
  callback,
  isLoading,
  count,
  totalCount = false,
  extraCss,
}: LoadMoreProps) => {
  return (
    <caption
      className={cn(
        "caption-bottom bg-light-bg-secondary dark:bg-dark-bg-secondary mt-0 border-t border-light-border-primary dark:border-dark-border-primary text-start rounded-b pl-0",
        extraCss
      )}
    >
      <div className="flex items-center justify-between max-w-[100vw] h-full pr-3.5 md:pr-2.5 pb-2">
        <button
          className="flex items-center justify-center text-light-font-100 dark:text-dark-font-100 
        text-sm lg:text-[13px] md:text-xs h-full pl-5 md:pl-2.5 sticky top-0 left-[-1px] mb-0.5"
          onClick={callback}
        >
          Load more
          {isLoading ? <Spinner extraCss="ml-[7.5px]" /> : null}
        </button>
        {totalCount && totalCount !== 0 ? (
          <SmallFont extraCss="font-medium ">
            {count} out of {totalCount}
          </SmallFont>
        ) : null}{" "}
      </div>
    </caption>
  );
};
