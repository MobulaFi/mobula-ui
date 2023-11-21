import {Button, Image, Flex} from "@chakra-ui/react";
import {CheckIcon} from "@chakra-ui/icons";
import {useContext} from "react";
import {TextExtraSmall, TextSmall} from "../../../../../../UI/Text";
import {BaseAssetContext} from "../../../context-manager";
import {useColors} from "../../../../../../common/utils/color-mode";

export const TradeLiquidityPoolPopup = () => {
  const {text80, bordersActive, text40} = useColors();
  const {selectedTradeFilters} = useContext(BaseAssetContext);
  return (
    <Flex direction="column" maxH="400px" overflowY="scroll">
      {Array.from({length: 5})?.map((entry, i) => (
        <Flex
          align="center"
          mt={i !== 0 ? "7.5px" : "0px"}
          mb={i === ([1, 2, 3, 4, 5].length || 0) - 1 ? "0px" : "7.5px"}
        >
          <Button
            boxSize="16px"
            borderRadius="4px"
            border={bordersActive}
            onClick={() => {}}
          >
            <CheckIcon
              fontSize="11px"
              color={text80}
              opacity={
                selectedTradeFilters.liquidity_pool.includes("entry") ? 1 : 0
              }
            />
          </Button>
          <Image
            ml="15px"
            borderRadius="full"
            src="/logo/cardano.png"
            boxSize="25px"
            minW="25px"
            mr="10px"
          />
          <Flex direction="column">
            <TextSmall color={text80}>Cardano</TextSmall>
            <TextExtraSmall color={text40}>
              Uniswap * Liquidity: $XXM
            </TextExtraSmall>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
