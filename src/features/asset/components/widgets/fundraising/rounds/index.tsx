import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {useContext} from "react";
import {MdCurrencyExchange} from "react-icons/md";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../../../utils/helpers/formaters";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {TagPercentage} from "../../../../../../User/Portfolio/components/ui/tag-percentage";
import {BaseAssetContext} from "../../../../context-manager";

export const Rounds = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {
    text80,
    hover,
    text20,
    text40,
    text10,
    text60,
    borders,
    boxBg3,
    boxBg6,
  } = useColors();
  const arr = [1, 2, 3, 4, 5, 5];
  const {colorMode} = useColorMode();
  const isDark = colorMode === "dark";
  const bgLine = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const {onToggle, isOpen, onClose} = useDisclosure();
  const getTokenomics = sale => [
    {
      name: "Tokens for Sale",
      value: getFormattedAmount(sale.amount || 0),
    },
    {
      name: "% of Total Supply",
      value: getTokenPercentage(sale.amount / (baseAsset?.total_supply || 0)),
    },
    {
      name: "Pre-valuation",
      value: getFormattedAmount(sale.valuation || 0),
    },
    {
      name: "Platform",
      value: sale.platform || "--",
    },
    {
      name: "Price",
      value: sale.price,
    },
    {
      name: "Fundraising Goal",
      value: sale.fundraisingGoal !== 0 ? sale.fundraisingGoal : "--",
    },
  ];

  const getPercentageFromVestingType = (vestingType: any): string | number => {
    if (vestingType?.includes("/")) {
      const [unlockedStr, totalStr] = vestingType.split("/");
      const extractNumber = str => parseInt(str.match(/\d+/)[0], 10);
      const unlocked = extractNumber(unlockedStr);
      const total = extractNumber(totalStr);
      return (unlocked / total) * 100;
    }
    if (vestingType?.includes("100%")) return 100;
    if (vestingType?.includes("No Lock")) return 100;
    return "?";
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = {day: "numeric", month: "short", year: "numeric"};
    return date.toLocaleDateString("en-US", options as any);
  }

  const getLogoFromLaunchPlatform = name => {
    if (name === ("Series A" || "Series B")) return "/";
    if (!name.includes("Public Sale (")) return "/mobula/unknown.png";
    const extractPlatform = str => str.match(/\(([^)]+)\)/)?.[1];
    const removeUselessValue = extractPlatform(name).split(" ")[2];
    switch (removeUselessValue) {
      case "KuCoin":
        return "https://assets.staticimg.com/cms/media/3gfl2DgVUqjJ8FnkC7QxhvPmXmPgpt42FrAqklVMr.png";
      case "BitForex":
        return "https://seeklogo.com/images/B/bitforex-logo-332849AE2A-seeklogo.com.png";
      case "OKX":
        return "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo-black-and-white.jpg";
      case "Bybit":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/bybit-logo-white.jpg";
      case "Gate.io":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/gate-io-logo-white.jpg";
      case "Binance":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/binance-logo-white.jpg";
      case "Huobi":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/huobi-logo-white.jpg";
      default:
        return "/mobula/unknown.png";
    }
  };

  const getValue = (name, value) => {
    if (name === "Price") {
      if (value) return `$${getFormattedAmount(value)}`;
      return "--";
    }
    if (value && typeof value === "number")
      return `${getFormattedAmount(value)}`;
    if (value && typeof value === "string") return value;
    return "--";
  };

  return (
    <>
      <TextLandingMedium color={text80} mb="15px">
        Fundraising Rounds
      </TextLandingMedium>
      <Accordion allowToggle allowMultiple defaultIndex={0}>
        {baseAsset?.sales
          ?.sort((a, b) => b.date - a.date)
          ?.filter(entry => entry.date)
          ?.map(sale => {
            const leadInvestor = sale.investors?.find(entry => entry.lead);
            const percentageOfVestingShare: any = getTokenPercentage(
              getPercentageFromVestingType(
                (sale?.unlockType as string) || ("0/0" as string),
              ) as any,
            ) as any;
            const unlockedAmount =
              (Number(sale.amount) * Number(percentageOfVestingShare)) / 100 ||
              0;
            const platformImage = getLogoFromLaunchPlatform(sale.name);
            return (
              <AccordionItem
                borderRadius="8px"
                bg={boxBg3}
                p="10px"
                mb="15px"
                border={borders}
                _hover={{bg: hover}}
                transition="all 300ms ease-in-out"
              >
                <AccordionButton _hover={{bg: "none"}} px="0px">
                  <Flex align="center">
                    <Image
                      src={platformImage}
                      boxSize="30px"
                      border={borders}
                      fallback={
                        <Flex
                          boxSize="30px"
                          borderRadius="full"
                          align="center"
                          border={borders}
                          justify="center"
                          mr="7.5px"
                          bg={hover}
                        >
                          <Icon
                            as={MdCurrencyExchange}
                            color={text80}
                            fontSize={["18px"]}
                          />
                        </Flex>
                      }
                      borderRadius="full"
                      mr="7.5px"
                    />
                    <Flex direction="column" align="start">
                      <Flex align="center" wrap="wrap" mr="10px">
                        <TextLandingMedium
                          fontSize={["14px", "14px", "16px", "18px"]}
                          fontWeight="500"
                          textAlign="start"
                          mr="10px"
                          color={text80}
                        >
                          {`${sale.name}`}
                        </TextLandingMedium>
                        <TextLandingSmall>
                          {formatDate(sale.date)}
                        </TextLandingSmall>{" "}
                      </Flex>
                      <Flex>
                        <TextSmall mr="10px" textAlign="start">
                          Price:{" "}
                          <Box as="span" fontWeight="500">
                            {getFormattedAmount(sale.price)}$
                          </Box>
                        </TextSmall>
                        <TextSmall textAlign="start">
                          Raised:{" "}
                          <Box as="span" fontWeight="500">
                            ${getFormattedAmount(sale.raised)}
                          </Box>
                        </TextSmall>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex align="center" ml="auto">
                    {sale.price !== 0 && sale.price ? (
                      <Flex align="center" mr="10px" textAlign="end">
                        <TextSmall display={["none", "none", "flex"]}>
                          ROI USD
                        </TextSmall>{" "}
                        <TagPercentage
                          percentage={(baseAsset?.price || 0) / sale.price}
                          isUp={(baseAsset?.price || 0) / sale.price > 1}
                          isMultiple
                        />
                      </Flex>
                    ) : null}
                    <AccordionIcon />
                  </Flex>
                </AccordionButton>
                <AccordionPanel p="10px" pb={sale.unlockType ? "20px" : "0px"}>
                  <TextLandingSmall
                    fontWeight="600"
                    color={text80}
                    w="fit-content"
                    pb="2px"
                    mt="5px"
                    mb="5px"
                  >
                    Tokenomics:
                  </TextLandingSmall>
                  <Flex wrap="wrap">
                    {getTokenomics(sale).map((entry, i) => {
                      const even = i % 2 === 0;
                      const isLastTwo =
                        i === arr.length - 1 || i === arr.length - 2;

                      const newValue = getValue(entry.name, entry.value);
                      return (
                        <Flex
                          w={["100%", "50%"]}
                          py="10px"
                          justify="space-between"
                          borderRight={["none", even ? borders : "none"]}
                          borderBottom={[borders, isLastTwo ? "none" : borders]}
                          px="10px"
                          align="center"
                        >
                          <TextSmall fontWeight="500" color={text60}>
                            {entry.name}
                          </TextSmall>
                          {entry.name === "Platform" ? (
                            <TextSmall fontWeight="600">
                              {entry.value}
                            </TextSmall>
                          ) : null}
                          {entry.name !== "% of Total Supply" &&
                          entry.name !== "Platform" ? (
                            <TextSmall fontWeight="600">{newValue}</TextSmall>
                          ) : null}
                          {entry.name === "% of Total Supply" ? (
                            <Flex align="center">
                              <TextSmall fontWeight="600">
                                {getTokenPercentage(entry.value)}%
                              </TextSmall>
                            </Flex>
                          ) : null}
                        </Flex>
                      );
                    })}
                  </Flex>
                  <TextLandingSmall
                    fontWeight="600"
                    color={text80}
                    w="fit-content"
                    pb="2px"
                    // borderBottom="1px solid #5C7DF9"
                    mb="15px"
                    pt="20px"
                  >
                    Investors:
                  </TextLandingSmall>
                  <Flex
                    align={["start", "center"]}
                    justify={["start", "space-between"]}
                    direction={["column", "row"]}
                  >
                    <Flex align="center" mb={["10px", "0px"]}>
                      <Image
                        src={leadInvestor?.image}
                        fallbackSrc="/icon/unknown.png"
                        borderRadius="full"
                        boxSize="34px"
                        mb="-2px"
                        mr="7.5px"
                      />
                      {leadInvestor ? (
                        <Flex direction="column">
                          <TextSmall fontWeight="500" m="0px">
                            {leadInvestor?.name}
                          </TextSmall>
                          <Flex align="center">
                            <TextSmall
                              fontSize="12px"
                              fontWeight="500"
                              color={text60}
                              m="0px"
                            >
                              {leadInvestor?.type}
                            </TextSmall>
                            <Flex
                              bg="blue"
                              px="5px"
                              ml="7.5px"
                              borderRadius="4px"
                              color="rgba(225,255,255,0.8)"
                              fontSize="11px"
                              fontWeight="600"
                            >
                              Lead
                            </Flex>
                          </Flex>
                        </Flex>
                      ) : (
                        <TextSmall fontWeight="500" m="0px">
                          No Investors found yet
                        </TextSmall>
                      )}
                    </Flex>{" "}
                    <AvatarGroup max={8} size={["xs", "sm"]} spacing="-3">
                      {sale?.investors
                        ?.filter(entry => !entry.lead)
                        .map(investor => (
                          <Avatar
                            name={`${investor?.name} logo`}
                            src={investor?.image || "/icon/unknown.png"}
                            icon={
                              <Image src="/icon/unknown.png" boxSize="100%" />
                            }
                            bg={boxBg6}
                          />
                        ))}
                    </AvatarGroup>
                  </Flex>
                  <Flex mt="20px">
                    {sale.unlockType ? (
                      <Flex w="100%" direction="column">
                        <TextLandingSmall
                          fontWeight="600"
                          color={text80}
                          w="fit-content"
                          pb="2px"
                          // borderBottom="1px solid #5C7DF9"
                          mb="5px"
                          pt="10px"
                        >
                          Vesting:
                        </TextLandingSmall>
                        <Flex align="center" justify="space-between">
                          <Flex align="center">
                            <Text
                              color={text60}
                              fontWeight="500"
                              mb="5px"
                              fontSize="13px"
                            >
                              Unlock at launch:
                            </Text>
                            <Text
                              color={text80}
                              fontWeight="500"
                              mb="5px"
                              fontSize="13px"
                              ml="10px"
                            >
                              {sale?.unlockType
                                ? `${getFormattedAmount(unlockedAmount)} SUI`
                                : "--"}
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              color={text60}
                              fontWeight="500"
                              mb="5px"
                              fontSize="13px"
                            >
                              Locked:
                            </Text>
                            <Text
                              color={text80}
                              fontWeight="500"
                              mb="5px"
                              fontSize="13px"
                              ml="10px"
                            >
                              {sale?.unlockType
                                ? `${getFormattedAmount(
                                    sale.amount - unlockedAmount,
                                  )}SUI`
                                : "--"}{" "}
                            </Text>
                          </Flex>
                        </Flex>
                        <Popover
                          isOpen={isOpen}
                          onClose={onClose}
                          placement="bottom"
                          closeOnBlur={false}
                        >
                          <PopoverTrigger>
                            <Flex
                              mt="5px"
                              w="100%"
                              h="7px"
                              borderRadius="full"
                              bg={bgLine}
                              position="relative"
                              overflow="hidden"
                              onMouseEnter={() => {
                                if (sale?.unlockType) onToggle();
                              }}
                              onMouseLeave={() => onClose()}
                            >
                              {/* {!sale?.unlockType
                                ? Array.from({length: 11})?.map((_, i) => (
                                    <Flex
                                      w="15%"
                                      h={["200%", "250%", "400%"]}
                                      mx="auto"
                                      top={["-10px", "-20px"]}
                                      position="absolute"
                                      left={`${(i - 1) * 10}%`}
                                      bg={hover}
                                      transform="rotate(-45deg)"
                                    />
                                  ))
                                : null} */}
                              <Flex
                                w={`${percentageOfVestingShare}%`}
                                h="100%"
                                bg={text40}
                                borderRadius="full"
                              />
                            </Flex>
                          </PopoverTrigger>
                          <PopoverContent
                            borderRadius="8px"
                            border={borders}
                            bg={hover}
                            w="fit-content"
                          >
                            <PopoverArrow bg={hover} />
                            <PopoverBody>
                              <Flex
                                direction="column"
                                align="center"
                                minW="200px"
                              >
                                <Flex
                                  justify="space-between"
                                  align="center"
                                  w="100%"
                                >
                                  <Text
                                    color={text80}
                                    mb="5px"
                                    fontSize="13px"
                                    fontWeight="500"
                                    mr="10px"
                                  >
                                    Unlocked
                                  </Text>
                                  {sale?.unlockType ? (
                                    <Text
                                      color={text60}
                                      mb="5px"
                                      fontSize="13px"
                                    >
                                      {getFormattedAmount(unlockedAmount)} SUI
                                    </Text>
                                  ) : (
                                    "No data"
                                  )}
                                </Flex>
                                <Flex
                                  justify="space-between"
                                  align="center"
                                  w="100%"
                                >
                                  <Text
                                    color={text80}
                                    mb="5px"
                                    fontSize="13px"
                                    fontWeight="500"
                                    mr="10px"
                                  >
                                    Locked
                                  </Text>
                                  <Text color={text60} mb="5px" fontSize="13px">
                                    {getFormattedAmount(
                                      sale.amount - unlockedAmount,
                                    )}{" "}
                                    SUI
                                  </Text>
                                </Flex>

                                <Flex h="1px" w="100%" bg={text10} my="5px" />
                                <Flex
                                  justify="space-between"
                                  align="center"
                                  w="100%"
                                >
                                  <Text
                                    color={text80}
                                    mb="5px"
                                    fontSize="13px"
                                    fontWeight="500"
                                  >
                                    Percentage
                                  </Text>
                                  <Text color={text60} mb="5px" fontSize="13px">
                                    {`${percentageOfVestingShare}%`}
                                  </Text>
                                </Flex>
                                <Flex
                                  w="100%"
                                  bg={text10}
                                  h="6px"
                                  borderRadius="full"
                                >
                                  <Flex
                                    w={`${percentageOfVestingShare}%`}
                                    bg={text20}
                                    h="100%"
                                    borderRadius="full"
                                  />
                                </Flex>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    ) : null}
                    {/* <Flex w="50%" direction="column" ml="20px">
                      <TextLandingSmall
                        fontWeight="600"
                        color={text80}
                        w="fit-content"
                        pb="2px"
                        // borderBottom="1px solid #5C7DF9"
                        mb="5px"
                        pt="10px"
                      >
                        More Details Link:
                      </TextLandingSmall>
                      <NextChakraLink
                        color={text80}
                        href={sale.links?.[0]?.url}
                      >
                        <TextSmall
                          _hover={{color: "blue"}}
                          transition="all 250ms ease-in-out"
                          whiteSpace="nowrap"
                          overflowX="hidden"
                          textOverflow="ellipsis"
                        >
                          {" "}
                          {sale.links?.[0]?.url || "--"}
                        </TextSmall>
                      </NextChakraLink>
                    </Flex> */}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            );
          })}{" "}
      </Accordion>
    </>
  );
};
