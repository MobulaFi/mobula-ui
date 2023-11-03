import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Icon, Image, Spinner } from "@chakra-ui/react";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useState } from "react";
import { VscArrowSwap } from "react-icons/vsc";
import { useNetwork } from "wagmi";
import { SwapContext } from "../../..";
// eslint-disable-next-line import/no-cycle
// import {ColorsContext} from "../../../../../../../pages/iframe/swap";
import { TextSmall } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../lib/mixpanel";
import { Settings } from "../../../common/popup/settings";
import { DISABLED_STATUS } from "../../../constants";
import { useLoadToken } from "../../../hooks/useLoadToken";
import { ISwapContext } from "../../../model";
import { ProTitle } from "./components/header";
import { SwapBox } from "./components/swap-box";
import { InfoPopupQuotes } from "./popup/quotes";

export const Litedex = ({
  isWidget = false,
  isDex = false,
}: {
  isWidget?: boolean;
  isDex?: boolean;
}) => {
  const {
    tokenIn,
    tokenOut,
    buttonStatus,
    buttonLoading,
    isFeesLoading,
    handleButtonClick,
    tokenOutBuffer,
    tokenInBuffer,
    setTokenInBuffer,
    setTokenOutBuffer,
    quotes,
    chainNeeded,
    manualQuote,
    slippageTokenIn,
    slippageTokenOut,
    setLockToken,
  } = useContext<ISwapContext>(SwapContext);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [showGweiSettings, setShowGweiSettings] = useState<boolean>(false);
  const { loadToken } = useLoadToken();
  const { chain } = useNetwork();
  const { text40, borders, boxBg3, text60, text80 } = useColors();
  const { bgMain, fontSecondary, fontMain, bgButton, borderColor } = {
    bgMain: "#1A1A1A",
    fontSecondary: "#8B8B8B",
    fontMain: "#FFFFFF",
    bgButton: "#1A1A1A",
    borderColor: "#1A1A1A",
  };
  // useContext(ColorsContext);

  // Syntaxic sugar
  const currentChain = chainNeeded || chain?.id || 1;
  const chainData = blockchainsIdContent[currentChain];
  const supportedProtocols =
    chainData?.supportedProtocols.filter(
      (entry) =>
        (slippageTokenIn &&
          slippageTokenOut &&
          slippageTokenIn <= 0.25 &&
          slippageTokenOut <= 0.25) ||
        entry === "forkV2"
    ) || [];
  const quotesAmount = quotes.length - 1;

  return (
    <Box w="100%" borderRadius="8px">
      <ProTitle
        showGweiSettings={showGweiSettings}
        setShowGweiSettings={setShowGweiSettings}
        setSettingsVisible={setSettingsVisible}
      />
      <Flex
        p="20px"
        align="flex-start"
        bg={bgMain || boxBg3}
        direction="column"
        w="100%"
      >
        {/* IN */}
        <Flex direction="column" position="relative" w="100%">
          <SwapBox position="in" isDex={isDex} />
          {/* ARROW */}
          <Button
            my="0px"
            bg={bgMain || boxBg3}
            border={borderColor || borders}
            color={fontSecondary || text60}
            mx="auto"
            p="5px"
            position="absolute"
            borderRadius="full"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            zIndex={2}
            _hover={{ color: fontMain || text80 }}
            transition="all 250ms ease-in-out"
            onClick={() => {
              if (tokenOutBuffer) setTokenOutBuffer(undefined);
              if (tokenIn && tokenOut && !tokenOutBuffer && !tokenInBuffer) {
                setLockToken([]);
                setTokenOutBuffer(tokenOut);
                setTokenInBuffer(tokenIn);
                loadToken("out", tokenIn);
                loadToken("in", tokenOut);
              }
              pushData("TRADE-INTERACT");
              pushData("TRADE-SWITCH-ARROW");
            }}
            isDisabled={
              !!buttonLoading ||
              isFeesLoading ||
              !!tokenInBuffer ||
              !!tokenOutBuffer
            }
          >
            <Icon as={VscArrowSwap} fontSize="18px" transform="rotate(90deg)" />
          </Button>
          <Flex
            w="10px"
            h="10px"
            bg={bgMain || boxBg3}
            position="absolute"
            top="50%"
            left="50%"
            zIndex={3}
            transform="translate(-200%,-50%)"
          />
          <Flex
            w="10px"
            h="10px"
            bg={bgMain || boxBg3}
            position="absolute"
            top="50%"
            left="50%"
            zIndex={3}
            transform="translate(100%,-50%)"
          />
          {/* OUT */}
          <SwapBox position="out" isDex={isDex} />
        </Flex>
        <Button
          variant="outlined"
          fontSize={["12px", "12px", "13px", "14px"]}
          fontWeight="500"
          mt="15px"
          h={[
            isDex ? "35px" : "30px",
            isDex ? "35px" : "30px",
            isDex ? "40px" : "35px",
          ]}
          bg={bgButton || "none"}
          color={fontMain || text80}
          onClick={() => handleButtonClick()}
          id={`trade-${buttonStatus.toLowerCase()}`}
          border={`1px solid ${
            borderColor || "var(--chakra-colors-borders-blue)"
          }`}
          _hover={{
            border: `1px solid ${borderColor || "var(--chakra-colors-blue)"}`,
          }}
          cursor={
            !!buttonLoading || DISABLED_STATUS.includes(buttonStatus)
              ? "not-allowed"
              : "pointer"
          }
        >
          {(buttonLoading || isFeesLoading) && (
            <Spinner width="15px" height="15px" mr={15} />
          )}{" "}
          {buttonStatus}
        </Button>
        <Flex
          align={isDex ? "start" : "center"}
          mt="15px"
          direction={isDex ? "column" : "row"}
        >
          <TextSmall
            color={fontSecondary || text40}
            fontWeight="500"
            mr="10px"
            fontSize={["12px", "12px", "14px", isDex ? "16px" : "14px"]}
            mb={isDex ? "3px" : "0px"}
          >
            Router used:{" "}
          </TextSmall>
          <Flex wrap="wrap" align="center">
            <InfoPopupQuotes position="top" isSwapRouter>
              <Flex align="center">
                <TextSmall color={fontMain || text80}>
                  {manualQuote?.protocol || quotes[0]?.protocol || "Loading..."}
                </TextSmall>
                {quotes.length ? (
                  <TextSmall ml="5px" color={fontMain || text60}>
                    {` (${quotesAmount || "no"} other${
                      quotesAmount > 1 ? "s" : ""
                    }${
                      supportedProtocols.length - quotes.length > 0
                        ? `, +${
                            supportedProtocols.length - quotes.length
                          } loading...`
                        : " available"
                    })`}
                  </TextSmall>
                ) : null}
                <ChevronDownIcon color={fontMain || text80} ml="5px" />
              </Flex>
            </InfoPopupQuotes>
          </Flex>
        </Flex>
        {isWidget ? (
          <Flex align="center" mt="15px">
            <Image src="/mobula/coinMobula.png" boxSize="18px" mr="7.5px" />
            <TextSmall color={fontSecondary || text40}>
              Powered by{" "}
              <NextChakraLink
                target="_blank"
                rel="noopener"
                _hover={{
                  color: "var(--chakra-colors-blue) !important",
                  opacity: 0.9,
                }}
                transition="all 200ms ease-in-out"
                href="https://mobula.fi"
                color={fontMain || text80}
              >
                Mobula.fi
              </NextChakraLink>
            </TextSmall>
          </Flex>
        ) : null}
        <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
      </Flex>
    </Box>
  );
};
