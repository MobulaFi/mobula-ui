import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FlexProps,
  Icon,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {blockchainsIdContent} from "mobula-lite/lib/chains/constants";
import {useContext, useRef, useState} from "react";
import {AiOutlineSwap, AiOutlineThunderbolt} from "react-icons/ai";
import {FiSettings} from "react-icons/fi";
import {useNetwork} from "wagmi";
import {SwapContext} from "../..";
import {getFormattedAmount} from "../../../../../../utils/helpers/formaters";
import {BaseAssetContext} from "../../../../../Pages/Assets/AssetV2/context-manager";
import {TitleContainer} from "../../../../../Pages/Misc/Dex/components/ui/container-title";
import {TextLandingSmall, TextSmall} from "../../../../../UI/Text";
import {pushData} from "../../../../data/utils";
import {useColors} from "../../../../utils/color-mode";
import {Settings} from "../../common/popup/settings";
import {useLoadToken} from "../../hooks/useLoadToken";
import {famousContractsLabelFromName} from "../../utils";
import {Select} from "../select";
import {TokenContainer} from "./token-container";

export const AssetPro = ({asset, ...props}: {asset?: any} & FlexProps) => {
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
    setManualQuote,
  } = useContext(SwapContext);
  const {loadToken} = useLoadToken();
  const inputInRef = useRef<HTMLInputElement>(null);
  const [selectVisible, setSelectVisible] = useState<string | boolean>();
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, hover, text40, borders, text60, boxBg6, boxBg3} = useColors();
  const {chain} = useNetwork();
  const [isHover, setIsHover] = useState(false);
  const {isOpen, onToggle, onClose} = useDisclosure();
  const quotesAmount = quotes.length - 1;
  const currentChain = chainNeeded || chain?.id || 1;
  const chainData = blockchainsIdContent[currentChain];
  const supportedProtocols =
    chainData?.supportedProtocols.filter(
      entry =>
        (slippageTokenIn &&
          slippageTokenOut &&
          slippageTokenIn <= 0.25 &&
          slippageTokenOut <= 0.25) ||
        entry === "forkV2",
    ) || [];

  const checkValidity = () => {
    if (asset) return asset?.contracts?.length === 0 || !asset?.tracked;
    return baseAsset?.contracts?.length === 0 || !baseAsset?.tracked;
  };

  const getColorOfActiveProtocol = i => {
    if (manualQuote) {
      if (manualQuote?.protocol === quotes?.[i]?.protocol) return "blue";
      return text80;
    }
    if (i === 0) return "blue";
    return text80;
  };

  return (
    <Flex
      direction="column"
      mt={["10px", "10px", "10px", "0px"]}
      w={["100%", "100%", "100%", "100%"]}
      maxWidth={["auto", "auto", "auto", "380px"]}
      minWidth="250px"
      h="fit-content"
      minH="auto"
      bg={boxBg3}
      border={borders}
      borderRadius="16px"
      mb="10px"
      {...props}
    >
      <TitleContainer px="10px" justify="space-between">
        <Text
          fontSize={["16px", "16px", "17px", "18px"]}
          fontWeight="500"
          textAlign="start"
          color={text80}
          w="fit-content"
          mr="auto"
        >
          Swap
        </Text>
        <Button
          boxSize={["16px", "16px", "17px", "18px"]}
          opacity={0.8}
          onClick={() => setSettingsVisible(true)}
          _focus={{boxShadow: "none"}}
        >
          <Icon as={FiSettings} color={text80} />
        </Button>
      </TitleContainer>
      {checkValidity() ? (
        <Flex align="center" justify="center" p="15px" h="100%">
          <TextLandingSmall maxW="200px" textAlign="center">
            {asset ? asset?.name : baseAsset?.name} can’t be traded on Mobula
            for now.
          </TextLandingSmall>
        </Flex>
      ) : (
        <Flex p="10px" direction="column" position="relative">
          <TokenContainer
            setSelectVisible={setSelectVisible}
            inputRef={inputInRef}
            position="in"
          />
          <Button
            bg={boxBg3}
            p="2px"
            borderRadius="full"
            border={borders}
            boxSize="30px"
            position="absolute"
            top="40px"
            left="50%"
            transform="translateX(-50%)"
            color={text40}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            _hover={{color: text80}}
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
            <Flex
              h="10px"
              w="10px"
              position="absolute"
              right="-5px"
              top="11px"
              bg={boxBg3}
            />
            <Flex
              h="10px"
              w="10px"
              position="absolute"
              left="-5px"
              top="11px"
              bg={boxBg3}
            />
            <Icon
              as={AiOutlineSwap}
              fontSize="20px"
              transform={isHover ? "rotate(90deg)" : "rotate(270deg)"}
            />
          </Button>
          <TokenContainer position="out" />
          <Button
            color={text80}
            fontSize={["11px", "11px", "12px", "14px"]}
            fontWeight="400"
            border="1px solid var(--chakra-colors-darkblue)"
            mt="10px"
            borderRadius="8px"
            h="37px"
            onClick={() => handleButtonClick()}
          >
            {(buttonLoading || isFeesLoading) && (
              <Spinner width="15px" height="15px" mr={15} />
            )}{" "}
            {buttonStatus}
          </Button>

          <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Flex
                onMouseEnter={() => {
                  onToggle();
                }}
                align="center"
                pt="7.5px"
                mx="auto"
              >
                <Icon as={AiOutlineThunderbolt} mr="5px" />
                <TextSmall>Best Price, 0 fees from Mobula</TextSmall>
                <ChevronDownIcon ml="5px" />
              </Flex>
            </PopoverTrigger>
            <PopoverContent
              w={["250px", "280px"]}
              maxW={["250px", "280px"]}
              borderRadius="12px"
              border={borders}
              bg={boxBg6}
              onMouseLeave={() => {
                onClose();
              }}
            >
              <PopoverArrow border="none !important" bg={boxBg3} />
              <PopoverBody
                color={text80}
                whiteSpace="pre-wrap"
                textAlign="start"
                fontSize={["12px", "12px", "13px", "14px"]}
              >
                <Flex direction="column" w="100%">
                  <TextLandingSmall textAlign="center" mb="10px">
                    Manually select a router
                  </TextLandingSmall>
                  {quotes?.map((entry, i) => (
                    <Flex
                      key={entry.protocol}
                      justify="space-between"
                      align="center"
                      cursor="pointer"
                      my="3.5px"
                      _hover={{
                        color: "var(--chakra-colors-blue) !important",
                      }}
                      onClick={() => {
                        setManualQuote(entry);
                        pushData("TRADE-SWITCH-ROUTE");
                        onClose();
                      }}
                    >
                      <Flex align="center">
                        <Image
                          src={
                            famousContractsLabelFromName[entry.protocol]?.logo
                          }
                          boxSize="20px"
                          borderRadius="full"
                          mr="5px"
                        />
                        <TextLandingSmall color={text80}>
                          {entry.protocol}
                        </TextLandingSmall>
                      </Flex>
                      <Flex align="center" ml="10px">
                        <TextSmall
                          fontSize={["12px", "12px", "13px", "14px"]}
                          color={getColorOfActiveProtocol(i)}
                          mr="5px"
                          fontWeight="500"
                        >
                          {getFormattedAmount(
                            entry.amountOut / 10 ** tokenOut!.decimals,
                            -2,
                          )}
                        </TextSmall>
                        <Image
                          src={tokenOut?.logo}
                          boxSize="14px"
                          borderRadius="full"
                        />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          {/* <Flex align="center">
              <TextSmall color={text80}>
                {manualQuote?.protocol || quotes[0]?.protocol || "Loading..."}
              </TextSmall>
              {quotes.length ? (
                <TextSmall ml="5px" color={text60}>
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
              <ChevronDownIcon color={text80} ml="5px" />
            </Flex> */}
        </Flex>
      )}
      {settingsVisible && (
        <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
      )}
      {selectVisible && (
        <Select
          visible={!!selectVisible}
          setVisible={setSelectVisible}
          position="in"
        />
      )}
    </Flex>
  );
};
