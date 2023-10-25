import { TableCellProps, Td } from "@chakra-ui/react";
import React, { useContext } from "react";
import { NextChakraLink } from "../../../components/link";
import { useColors } from "../../../lib/chakra/colorMode";
import { EntryContext } from "../context-manager";

interface SegmentProps extends TableCellProps {
  noLink?: boolean;
  children: React.ReactNode;
}

export const Segment = ({
  noLink = false,
  children,
  ...props
}: SegmentProps) => {
  const { borders, text100, text60 } = useColors();
  const { url } = useContext(EntryContext);
  return (
    <Td
      borderBottom={borders}
      fontWeight="500"
      fontSize={["13px", "13px", "14px", "14px"]}
      py={["5px", "5px", "5px", "5px", "15px"]}
      px={["10px", "10px", "15px", "15px"]}
      minH="76px"
      isNumeric
      {...props}
    >
      {noLink ? (
        children
      ) : (
        <NextChakraLink
          href={url}
          _hover={{ color: text100 }}
          color={text60 || text100}
        >
          {children}
        </NextChakraLink>
      )}
    </Td>
  );
};
