import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import {useContext} from "react";
import {SwapContext} from "../../../../..";
import {Settings} from "../../../../../model";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {useColors} from "../../../../../../../utils/color-mode";

export const InputLines = ({
  children,
  title,
  isSeconds,
  isMobile,
  ...props
}: {
  children: string;
  title: keyof Settings;
  isSeconds?: boolean;
  isMobile?: boolean;
  [key: string]: any;
}) => {
  const {settings, setSettings} = useContext(SwapContext);
  const {fontSecondary, bgBox, borderColor} = useContext(ColorsContext);
  const {boxBg6, borders, text60} = useColors();
  return (
    <Flex my="7.5px" align="center" justify="space-between" w="100%">
      <Text color={fontSecondary || text60} fontSize="14px" fontWeight="400">
        {children}
      </Text>
      <InputGroup
        border={borderColor ? `1px solid ${borderColor}` : borders}
        maxWidth="80px"
        h={["25px", "25px", "30px", "30px"]}
        borderRadius="4px"
        bg={bgBox || boxBg6}
        minWidth="50px"
        alignItems="center"
        {...props}
      >
        <Input
          pr="22px"
          type="number"
          pl="7.5px"
          color={fontSecondary || text60}
          pt="0px"
          pb={["1px", "1px", "0px"]}
          onChange={e => {
            setSettings(prev => ({
              ...prev,
              [e.target.name]: parseFloat(e.target.value),
            }));
          }}
          value={String(settings[title])}
          name={title}
        />
        <InputRightElement h="100%" pr="2px">
          <Text
            mr="5px"
            color={fontSecondary || text60}
            fontWeight="400"
            fontSize="16px"
          >
            {isSeconds ? "sec" : "%"}
          </Text>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
