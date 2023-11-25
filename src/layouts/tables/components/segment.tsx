import { cn } from "@/lib/utils";
import { TableCellProps } from "@chakra-ui/react";
import React, { useContext } from "react";
import { NextChakraLink } from "../../../components/link";
import { EntryContext } from "../context-manager";

interface SegmentProps extends TableCellProps {
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
        "font-medium border-b border-light-border-primary dark:border-dark-border-primary text-sm md:text-[13px] py-[15px] min-h-[76px] text-end px-5 text-light-font-100 dark:text-dark-font-100",
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
