import { Button, Flex, Input } from "@chakra-ui/react";
import React from "react";
import { TextSmall } from "../../../../../../../components/fonts";
import { useColors } from "../../../../../../../lib/chakra/colorMode";

export const FiltersRange = ({ state, setState }) => {
  const { boxBg6, borders, text80 } = useColors();
  return (
    <Flex direction="column" w="100%">
      <Flex w="100%">
        <Flex direction="column" w="50%" mr="5px">
          <TextSmall>From</TextSmall>
          <Input
            bg={boxBg6}
            border={borders}
            color={text80}
            _placeholder={{ color: text80 }}
            placeholder={state.from}
            borderRadius="8px"
            type="number"
            onChange={(e) =>
              setState((prev) => ({ ...prev, from: e.target.value }))
            }
          />
        </Flex>
        <Flex direction="column" w="50%" ml="5px">
          <TextSmall>To</TextSmall>
          <Input
            bg={boxBg6}
            border={borders}
            color={text80}
            _placeholder={{ color: text80 }}
            placeholder={state.to}
            borderRadius="8px"
            type="number"
            onChange={(e) =>
              setState((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </Flex>
      </Flex>
      <Button variant="outlined_grey">Reset</Button>
    </Flex>
  );
};
