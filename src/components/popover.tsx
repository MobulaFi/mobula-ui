import React from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface PopoverProps {
  visibleContent: React.ReactNode;
  hiddenContent: React.ReactNode;
  onToggle: Function;
  extraCss?: string;
  isOpen: boolean;
  isFilters?: boolean;
}

export const Popover = ({
  visibleContent,
  hiddenContent,
  onToggle,
  extraCss,
  isOpen,
  isFilters,
}: PopoverProps) => {
  return (
    <div
      className={`flex relative ${isFilters ? "pb-[8px]" : ""}`}
      onMouseEnter={() => onToggle()}
      onMouseLeave={() => onToggle()}
    >
      <span className="z-[10] w-full">{visibleContent}</span>
      {isOpen ? (
        <div
          className={cn(
            "absolute border border-light-border-primary dark:border-dark-border-primary rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary font-medium p-2.5 w-fit shadow-md z-[101]",
            extraCss
          )}
        >
          {hiddenContent}
        </div>
      ) : null}
    </div>
  );
};
