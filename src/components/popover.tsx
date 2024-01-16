import React from "react";
import {
  Popover as PopoverContainer,
  PopoverContent,
  PopoverTrigger,
} from "../lib/shadcn/components/ui/popover";
import { cn } from "../lib/shadcn/lib/utils";

interface PopoverProps {
  visibleContent: React.ReactNode;
  hiddenContent: React.ReactNode;
  onToggle: Function;
  extraCss?: string;
  isOpen: boolean;
  isFilters?: boolean;
  setIsOpen: any;
  position?: string;
}

export const Popover = ({
  visibleContent,
  hiddenContent,
  extraCss,
  isOpen,
  onToggle,
  position,
  setIsOpen,
}: PopoverProps) => {
  return (
    <PopoverContainer
      className="relative bg-red dark:bg-red"
      open={isOpen}
      onOpenChange={onToggle}
    >
      <PopoverTrigger>{visibleContent}</PopoverTrigger>
      <PopoverContent
        className={cn(
          `border border-light-border-primary dark:border-dark-border-primary rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary font-normal p-2.5 w-fit shadow-2xl z-[101]`,
          extraCss
        )}
        align={position || "start"}
      >
        {hiddenContent}
      </PopoverContent>
    </PopoverContainer>
  );
};
