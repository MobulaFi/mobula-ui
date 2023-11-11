import React, { useState } from "react";
import { cn } from "../@/lib/utils";

interface AccordionProps {
  visibleContent: React.ReactNode;
  hiddenContent: React.ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const Accordion = ({
  visibleContent,
  hiddenContent,
  extraCss,
  ...props
}: AccordionProps) => {
  const [showHiddenContent, setShowHiddenContent] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          "flex justify-between items-center w-full py-2.5 cursor-pointer border-light-border-primary dark:border-dark-border-primary",
          extraCss
        )}
        onClick={() => setShowHiddenContent((prev) => !prev)}
      >
        {visibleContent}
      </div>
      {showHiddenContent ? (
        <div className="flex flex-col w-full">{hiddenContent}</div>
      ) : null}
    </div>
  );
};
