import {ChevronDownIcon} from "@chakra-ui/icons";
import {Flex, Image} from "@chakra-ui/react";
import {useContext} from "react";
import {SwapContext} from "../../../../..";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {TextSmall} from "../../../../../../../../UI/Text";
import {useColors} from "../../../../../../../utils/color-mode";

export const SelectedToken = ({
  isTokenIn,
  isDefault,
}: {
  isTokenIn?: boolean;
  isDefault?: boolean;
}) => {
  const {tokenIn, tokenOut, tokenOutBuffer, tokenInBuffer} =
    useContext(SwapContext);
  const {fontMain, bgTitle, borderColor} = useContext(ColorsContext);
  const {borders, boxBg6, text80, hover} = useColors();
  const token = isTokenIn ? tokenIn : tokenOut;
  const buffer = isTokenIn ? tokenInBuffer : tokenOutBuffer;
  return (
    <Flex
      align="center"
      px="10px"
      borderRadius="full"
      border={borderColor ? `1px solid ${borderColor}` : borders}
      h="30px"
      bg={bgTitle || boxBg6}
      _hover={{bg: bgTitle || hover}}
      transition="all 250ms ease-in-out"
    >
      {!isDefault ? (
        <Image
          src={buffer?.logo || token?.logo}
          fallbackSrc="/icon/unknown.png"
          boxSize="15px"
          borderRadius="full"
        />
      ) : null}

      <TextSmall
        ml={isDefault ? "0px" : "7.5px"}
        mr="3px"
        color={fontMain || text80}
      >
        {isDefault ? "Select a token" : buffer?.symbol || token?.symbol}
      </TextSmall>
      {!tokenOutBuffer || isTokenIn || isDefault ? (
        <ChevronDownIcon
          color={fontMain || text80}
          fontSize={["15px", "15px", "17px"]}
          mr={isDefault ? "0px" : "10px"}
        />
      ) : null}
    </Flex>
  );
};
