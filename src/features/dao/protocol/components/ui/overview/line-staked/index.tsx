import {Flex, Icon, Box, Text} from "@chakra-ui/react";
import React from "react";
// import {IconType} from "react-icons/lib";
import {useColors} from "../../../../../../../common/utils/color-mode";

export const StakedLine = ({
  title,
  value,
  icon,
  ...props
}: {
  title: string;
  value: string;
  // icon: IconType;
  [key: string]: any;
}) => {
  const {text80, text60} = useColors();
  return (
    <Flex align="center" mb="10px" {...props}>
      <Icon as={icon} boxSize="18px" mt="1px" mr="10px" color={text80} />
      <Text color={text60} fontSize="14px" fontWeight="400">
        {" "}
        {title}
        <Box as="span" ml="5px" color={text80}>
          {value}
        </Box>
      </Text>
    </Flex>
  );
};
