import {Button, Circle, Flex, Text} from "@chakra-ui/react";
import React from "react";
import {useColors} from "../../../../../../common/utils/color-mode";

export const Lines = ({idx, setReason, texts, reason}) => {
  const {text80, borders, text10, text40} = useColors();
  return (
    <Flex
      align="center"
      borderBottom={borders}
      py="20px"
      justify="space-between"
    >
      <Flex direction="column">
        <Text color={text80} fontSize="13px" fontWeight="500">
          {texts.code}
        </Text>
        <Text maxWidth="280px" fontSize="11px" color={text40} fontWeight="500">
          {texts.name}
        </Text>
      </Flex>
      <Button
        onClick={() => {
          setReason(idx + 1);
        }}
      >
        <Circle
          mt="0px"
          size="16px"
          bg={reason === idx + 1 ? "blue" : text10}
        />
      </Button>
    </Flex>
  );
};
