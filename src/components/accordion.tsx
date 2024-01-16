import { cn } from "lib/shadcn/lib/utils";
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
    <div
      className={cn(
        `flex flex-col w-full h-full  ${
          showHiddenContent ? "max-h-[210px]" : "max-h-[45px]"
        } overflow-hidden transition-all duration-200 ease-linear`,
        extraCss
      )}
      {...props}
    >
      <div
        className="flex justify-between items-center w-full py-2.5 cursor-pointer border-light-border-primary dark:border-dark-border-primary"
        onClick={() => setShowHiddenContent((prev) => !prev)}
      >
        {visibleContent}
      </div>
      <div className="flex flex-col w-full">{children}</div>
    </div>
  );
};
