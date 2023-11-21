import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface AccordionProps {
  visibleContent: React.ReactNode;
  children: React.ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const Accordion = ({
  visibleContent,
  children,
  extraCss,
  ...props
}: AccordionProps) => {
  const [showHiddenContent, setShowHiddenContent] = useState(false);

  return (
    <div className={cn("flex flex-col w-full", extraCss)} {...props}>
      <div
        className="flex justify-between items-center w-full py-2.5 cursor-pointer border-light-border-primary dark:border-dark-border-primary"
        onClick={() => setShowHiddenContent((prev) => !prev)}
      >
        {visibleContent}
      </div>
      {showHiddenContent ? (
        <div className="flex flex-col w-full">{children}</div>
      ) : null}
    </div>
  );
};
