import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Flex, useMediaQuery} from "@chakra-ui/react";
import {useContext} from "react";
import {MainContainer} from "../../../../../UI/MainContainer";
import {TextLandingMedium} from "../../../../../UI/Text";
import {SwapProvider} from "../../../../../common/providers/swap";
import {Litedex} from "../../../../../common/providers/swap/components/swaps/main";
import {useColors} from "../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../context-manager";

export const SwapPopup = () => {
  const {baseAsset, showSwap, setShowSwap} = useContext(BaseAssetContext);
  const {boxBg6, text80, hover, borders} = useColors();
  const [isDesktop] = useMediaQuery("(min-width: 768px)", {
    ssr: true,
    fallback: false,
  });

  const getSwapPosition = () => {
    if (showSwap === 2) return "0px";
    if (showSwap === 1) return "-420px";
    return "-475px";
  };
  return (
    <MainContainer
      bottom={getSwapPosition()}
      transform="translateX(50%)"
      right="50%"
      position="fixed"
      zIndex="10"
      mb="0px"
      justify="flex-end"
      transition="all 250ms ease-in-out"
      display={["flex", "flex", "flex", "none"]}
    >
      <Flex
        direction="column"
        maxW="420px"
        w="100%"
        ml="auto"
        mr={["auto", "auto", "auto", "0px"]}
        bg={boxBg6}
        border={borders}
        borderRadius="16px 16px 0px 0px"
        boxShadow="1px 2px 13px 4px rgba(0, 0, 0, 0.2)"
        transition="all 250ms ease-in-out"
      >
        <Flex
          bg={boxBg6}
          align="center"
          borderRadius="16px 16px 0px 0px"
          justify="space-between"
          h="50px"
          px="15px"
          borderBottom="none"
        >
          <TextLandingMedium color={text80}>
            Trade {baseAsset?.symbol}
          </TextLandingMedium>
          <Button
            boxSize={["30px", "36px"]}
            borderRadius="full"
            bg={boxBg6}
            _hover={{
              bg: hover,
              border: hover,
            }}
            color={text80}
            transition="all 250ms ease-in-out"
            border={borders}
            onClick={() => {
              if (showSwap === 1) setShowSwap(2);
              else setShowSwap(1);
            }}
          >
            <ChevronDownIcon
              transform={showSwap ? "rotate(180deg)" : "rotate(0deg)"}
              color="blue"
              transition="all 250ms ease-in-out"
              fontSize="30px"
            />
          </Button>
        </Flex>
        {!isDesktop ? (
          <SwapProvider
            tokenOutBuffer={{
              ...baseAsset,
              blockchain: baseAsset?.blockchains[0],
              address:
                baseAsset && "contracts" in baseAsset
                  ? baseAsset.contracts[0]
                  : undefined,
              logo: baseAsset?.image || baseAsset?.logo,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name: baseAsset?.name || baseAsset?.symbol,
            }}
            lockToken={["out"]}
          >
            <Litedex />
          </SwapProvider>
        ) : null}
      </Flex>
    </MainContainer>
  );
};
