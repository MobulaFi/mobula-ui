import {Flex, Circle} from "@chakra-ui/react";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";

export const HoldingsList = ({
  isOdds,
  background,
  keys,
  value,
  size,
}: {
  isOdds: boolean;
  background: string;
  keys: string;
  value: string;
  size: string;
}) => {
  const {text40} = useColors();
  return (
    <Flex
      w={size}
      mr={isOdds ? "15px" : "0px"}
      borderRadius="2px"
      align="center"
      mt="5px"
    >
      <Circle size="10px" bg={background} mr="7.5px" />
      <Flex align="center">
        <TextSmall color={text40}> {keys}:</TextSmall>
        <TextSmall ml="7.5px">{value}</TextSmall>
      </Flex>
    </Flex>
  );
};
