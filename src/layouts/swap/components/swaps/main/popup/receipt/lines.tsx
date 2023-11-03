import { Flex } from "@chakra-ui/react";
import { TextLandingSmall } from "components/fonts";
import { useColors } from "lib/chakra/colorMode";

export const Lines = ({ title, children, ...props }) => {
  const { text80 } = useColors();
  return (
    <Flex justify="space-between" pb="10px" {...props}>
      <TextLandingSmall color={text80}>{title}</TextLandingSmall>
      {children}
    </Flex>
  );
};
