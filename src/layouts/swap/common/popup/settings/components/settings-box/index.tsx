import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {Dispatch, SetStateAction} from "react";
import {Settings} from "../../../../../model";

export const SettingBox = ({
  title,
  value,
  setValue,
  min,
  max,
  addOn,
  text,
  width = "90%",
}: {
  title: string;
  value: string | number | readonly string[];
  setValue: Dispatch<SetStateAction<Settings>>;
  min: number;
  max: number;
  addOn?: string;
  text?: string;
  width?: string;
}) => (
  <>
    <Text
      fontSize="14px"
      fontWeight="500"
      mt={addOn ? "5px" : "15px"}
      color="text.80"
    >
      {title}
    </Text>
    <Flex mt={3} align="center" justify="space-between" width={width}>
      <InputGroup borderRadius="4px" display="flex" alignItems="center">
        {addOn ? (
          <InputLeftElement children="%" fontSize="14px" ml="10px" h="100%" />
        ) : null}
        <Input
          width="90%"
          pl="25px"
          borderRadius="4px"
          height="30px"
          border="1px solid var(--chakra-colors-borders-1)"
          value={value}
          type="number"
          onChange={e =>
            setValue(prev => ({
              ...prev,
              slippage: Math.min(
                Math.max(parseFloat(e.target.value), min),
                max,
              ),
            }))
          }
          fontSize="0.8rem"
        />
      </InputGroup>
      {text ? (
        <Text color="text.80" fontSize="0.8rem">
          {text}
        </Text>
      ) : null}
    </Flex>
  </>
);
