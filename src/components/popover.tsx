import React from "react";
import { cn } from "../@/lib/utils";

interface PopoverProps {
  visibleContent: React.ReactNode;
  hiddenContent: React.ReactNode;
  onToggle: Function;
  extraCss?: string;
  isOpen: boolean;
}

export const Popover = ({
  visibleContent,
  hiddenContent,
  onToggle,
  extraCss,
  isOpen,
}: PopoverProps) => {
  return (
    <div
      className="flex relative z-[1000]"
      onMouseEnter={() => onToggle()}
      onMouseLeave={() => onToggle()}
    >
      <div>{visibleContent}</div>
      {isOpen ? (
        <div
          className={cn(
            "absolute z-[11] border border-light-border-primary dark:border-dark-border-primary rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary p-2.5 w-fit shadow-md",
            extraCss
          )}
        >
          {hiddenContent}
        </div>
      ) : null}
    </div>
  );
};
