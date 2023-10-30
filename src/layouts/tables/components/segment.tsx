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
  ...props
}: SegmentProps) => {
  const { url } = useContext(EntryContext);
  return (
    <td
      className={`font-medium text-sm md:text-[13px] py-[15px] min-h-[76px] text-end px-5 text-light-font-100 dark:text-dark-font-100 ${extraCss}`}
      // py={["5px", "5px", "5px", "5px", "15px"]}
      // px={["10px", "10px", "15px", "15px"]}
      {...props}
    >
      {noLink ? (
        children
      ) : (
        <NextChakraLink href={url}>{children}</NextChakraLink>
      )}
    </td>
  );
};
