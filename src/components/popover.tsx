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
  onToggle?: Function;
  extraCss?: string;
  isOpen?: boolean | undefined;
  isFilters?: boolean;
  position?: AlignProps;
}

type AlignProps = "center" | "start" | "end" | undefined;

export const Popover = ({
  visibleContent,
  hiddenContent,
  extraCss,
  isOpen,
  onToggle,
  position,
}: PopoverProps) => {
  return (
    <PopoverContainer open={isOpen} onOpenChange={onToggle as any}>
      <PopoverTrigger className="z-[100]">{visibleContent}</PopoverTrigger>
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
