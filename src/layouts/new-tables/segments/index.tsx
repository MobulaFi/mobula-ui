import React, { useContext } from "react";
import { NextChakraLink } from "../../../components/link";
import { cn } from "../../../lib/shadcn/lib/utils";
import { EntryContext } from "../context-manager";

interface SegmentProps {
  noLink?: boolean;
  children: React.ReactNode;
  extraCss?: string;
}

export const Segment = ({
  noLink = false,
  extraCss,
  children,
}: SegmentProps) => {
  const { url } = useContext(EntryContext);
  return (
    <td
      className={cn(
        "font-medium border-b border-light-border-primary dark:border-dark-border-primary text-sm md:text-[13px] py-[15px] min-h-[76px] md:min-h-[60px] md:py-[10px] text-end px-5 text-light-font-100 dark:text-dark-font-100",
        extraCss
      )}
    >
      {noLink ? (
        children
      ) : (
        <NextChakraLink href={url}>{children}</NextChakraLink>
      )}
    </td>
  );
};
