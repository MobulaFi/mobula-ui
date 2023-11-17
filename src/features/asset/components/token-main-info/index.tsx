import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {useContext, useEffect, useMemo, useState} from "react";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {TbBellRinging} from "react-icons/tb";
import {
  getClosest,
  getFormattedAmount,
  getTokenPercentage,
  removeScNotation,
} from "../../../../../../utils/helpers/formaters";
import {
  TextLandingLarge,
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../UI/Text";
import {UserContext} from "../../../../../common/context-manager/user";
import {useWatchlist} from "../../../../../common/ui/tables/hooks/watchlist";
import {useColors} from "../../../../../common/utils/color-mode";
import {IWatchlist} from "../../../../User/Watchlist/models";
import {timestamp, timestamps} from "../../constant";
import {BaseAssetContext} from "../../context-manager";
import {useAthPrice} from "../../hooks/use-athPrice";
import {useMarketMetrics} from "../../hooks/use-marketMetrics";
import {percentageTags, squareBox} from "../../style";

export const TokenMainInfo = () => {
  const [isHoverStar, setIsHoverStar] = useState(false);
  const [inWl, setInWl] = useState(false);
  const {priceLow, priceHigh} = useAthPrice();
  const {
    baseAsset,
    historyData,
    timeSelected,
    setUserTimeSelected,
    setShowTargetPrice,
    setShowSwap,
    showSwap,
  } = useContext(BaseAssetContext);
  const {handleAddWatchlist, inWatchlist} = useWatchlist(baseAsset.id);
  const {user} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const {marketMetrics} = useMarketMetrics(baseAsset);
  const [metricsChanges, setMetricsChanges] = useState(null);
  const {
    text80,
    boxBg6,
    boxBg3,
    hover,
    borders,
    bordersActive,
    text40,
    text60,
  } = useColors();
  const watchlist: IWatchlist = user?.main_watchlist;

  const getIconFromWatchlistState = () => {
    if (isLoading) return <Spinner h="13px" w="13px" color="blue" />;
    if (inWl || inWatchlist || isHoverStar)
      return <Icon as={AiFillStar} color="yellow" fontSize="16px" />;
    return <Icon as={AiOutlineStar} color={text40} fontSize="16px" />;
  };
  //   let interval: NodeJS.Timer;

  //   if (isVisible && !interval) {
  //     interval = setInterval(() => {
  //       setTimeout(() => {
  //         if (isVisible) {
  //           const supabase = createSupabaseDOClient();
  //           supabase
  //             .from("assets")
  //             .select("price,volume,market_cap,price_change_24h")
  //             .match({id: token.id})
  //             .single()
  //             .then(r => {
  //               if (
  //                 r.data &&
  //                 (r.data.price !== token.price ||
  //                   r.data.volume !== token.volume ||
  //                   r.data.market_cap !== token.market_cap)
  //               ) {
  //                 setMarketMetrics({
  //                   ...token,
  //                   price: r.data.price,
  //                   priceChange:
  //                     r.data.price !== token.price
  //                       ? r.data.price > token.price
  //                       : undefined,
  //                   volume: r.data.volume,
  //                   volumeChange:
  //                     r.data.volume !== token.volume
  //                       ? r.data.volume > token.volume
  //                       : undefined,
  //                   market_cap: r.data.market_cap,
  //                   marketCapChange:
  //                     r.data.market_cap !== token.market_cap
  //                       ? r.data.market_cap > token.market_cap
  //                       : undefined,
  //                   price_change_24h: r.data.price_change_24h,
  //                 });
  //               }
  //             });
  //         }
  //       }, 5000);
  //     }, 5000);
  //   }

  //   if (!isVisible && interval) {
  //     clearInterval(interval);
  //   }

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isVisible]);

  useEffect(() => {
    setMetricsChanges(newMetricsChange => {
      let updatedPrice;
      if (marketMetrics?.priceChange) updatedPrice = true;
      else if (marketMetrics?.priceChange !== undefined) updatedPrice = false;
      else updatedPrice = newMetricsChange?.price;
      return {
        ...newMetricsChange,
        price: updatedPrice,
      };
    });
    setTimeout(() => {
      setMetricsChanges(newMarketMetricsChange => ({
        ...newMarketMetricsChange,
        price: null,
      }));
    }, 800);
  }, [marketMetrics?.price]);

  useEffect(() => {
    if (user?.main_watchlist?.assets?.includes(baseAsset?.id)) setInWl(true);
  }, [user?.main_watchlist, baseAsset]);

  const priceChange = useMemo(() => {
    if (historyData?.price_history) {
      return (
        (baseAsset.price /
          getClosest(
            historyData.price_history.concat(
              baseAsset.price_history?.price || [],
            ),
            Math.max(Date.now() - timestamp[timeSelected], 0),
          ) -
          1) *
        100
      );
    }
    return baseAsset?.price_change_24h;
  }, [baseAsset, historyData, timeSelected]);

  const getColorFromMarketChange = () => {
    if (metricsChanges?.price) return "green";
    if (metricsChanges?.price === false) return "red";
    return text80;
  };
  const isUp = priceChange > 0;

  return (
    <Flex direction="column" w={["100%", "100%", "100%", "60%"]}>
      <Flex
        align="center"
        justify={[
          "space-between",
          "space-between",
          "space-between",
          "flex-start",
        ]}
        mb={["2px", "2px", "2px", "0px"]}
      >
        <Flex align="center">
          <Img
            src={baseAsset.logo}
            boxSize={["20px", "20px", "22px", "24px"]}
            mr="7.5px"
            borderRadius="full"
          />
          <Flex wrap="wrap" align="center">
            <Tooltip
              hasArrow
              label={baseAsset?.name}
              bg={boxBg6}
              border={borders}
              borderRadius="8px"
              placement="bottom"
              color={text80}
              py="2.5px"
              px="10px"
            >
              <Text
                fontSize={["16px", "16px", "18px", "20px"]}
                fontWeight="500"
                color={text80}
                mr="5px"
                display={["flex", "flex", "flex", "none"]}
              >
                {baseAsset.name.length > 15
                  ? `${baseAsset?.name.slice(0, 15)}...`
                  : baseAsset?.name}
              </Text>
            </Tooltip>
            {baseAsset.name.length <= 15 ? (
              <Text
                fontSize={["20px", "20px", "22px", "24px"]}
                fontWeight="500"
                color={text80}
                mr="5px"
                display={["none", "none", "none", "flex"]}
              >
                {baseAsset?.name}
              </Text>
            ) : null}
            {baseAsset.name.length > 15 ? (
              <Popover trigger="hover" matchWidth>
                <PopoverTrigger>
                  <Button>
                    <TextLandingLarge
                      fontWeight="500"
                      color={getColorFromMarketChange()}
                      cursor="default"
                    >
                      <Text
                        fontSize={["20px", "20px", "26px", "32px"]}
                        fontWeight="500"
                        color={text80}
                        mr="10px"
                        display={["none", "none", "none", "flex"]}
                      >
                        {baseAsset.name.length > 13
                          ? `${baseAsset?.name.slice(0, 13)}...`
                          : baseAsset?.name}
                      </Text>
                    </TextLandingLarge>
                  </Button>
                </PopoverTrigger>
                {baseAsset.name.length > 13 ? (
                  <PopoverContent
                    maxW="fit-content"
                    bg={boxBg3}
                    border={borders}
                    p="0px"
                    borderRadius="8px"
                  >
                    <PopoverBody color={text80}>{baseAsset?.name}</PopoverBody>
                  </PopoverContent>
                ) : null}
              </Popover>
            ) : null}
            <TextLandingMedium
              color={text40}
              mt={["0px", "0px", "3px"]}
              mb={["2px", "2px", "0px"]}
              fontSize={["16px", "16px", "18px", "20px"]}
            >
              {baseAsset?.symbol}
            </TextLandingMedium>
          </Flex>
        </Flex>
        <Flex align="center">
          <Button
            sx={squareBox}
            bg={boxBg6}
            border={borders}
            _hover={{
              border: bordersActive,
              bg: hover,
            }}
            transition="all 250ms ease-in-out"
            onMouseEnter={() => setIsHoverStar(true)}
            onMouseLeave={() => setIsHoverStar(false)}
            ml="0px"
            onClick={() => {
              if (inWl) {
                handleAddWatchlist(
                  baseAsset?.id,
                  watchlist?.id,
                  false,
                  setIsLoading,
                );
                setInWl(false);
              } else {
                handleAddWatchlist(
                  baseAsset?.id,
                  watchlist?.id,
                  true,
                  setIsLoading,
                );
                setInWl(true);
              }
            }}
          >
            {getIconFromWatchlistState()}
          </Button>

          <Button
            onClick={() => setShowTargetPrice(true)}
            color={text40}
            fontSize="20px"
            bg={boxBg6}
            borderRadius="8px"
            boxSize="26px"
            _hover={{color: text80, bg: hover}}
            transition="all 250ms ease-in-out"
            border={borders}
            ml="7.5px"
            mt="5px"
            mr="0px"
          >
            <Icon as={TbBellRinging} fontSize="18px" />
          </Button>
        </Flex>
      </Flex>
      {baseAsset?.tracked ? (
        <Flex direction="column">
          <Flex
            align="center"
            justify={[
              "space-between",
              "space-between",
              "space-between",
              "flex-start",
            ]}
            mt="5px"
            mb="7.5px"
          >
            <Popover trigger="hover" matchWidth>
              <PopoverTrigger>
                <Button>
                  <TextLandingLarge
                    fontSize={["24px", "24px", "24px", "32px"]}
                    fontWeight="500"
                    color={getColorFromMarketChange()}
                  >
                    ${getFormattedAmount(marketMetrics.price)}
                  </TextLandingLarge>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                maxW="fit-content"
                bg={boxBg3}
                border={borders}
                p="0px"
                borderRadius="8px"
              >
                <PopoverBody color={text80}>
                  {removeScNotation(marketMetrics.price)}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Flex align="center">
              <Flex {...percentageTags(isUp)} mr="10px">
                <TextLandingSmall color={isUp ? "green" : "red"}>
                  {isUp ? "+" : ""}
                  {getTokenPercentage(priceChange)}%
                </TextLandingSmall>
              </Flex>
              <Menu matchWidth>
                <MenuButton
                  border={borders}
                  borderRadius="8px"
                  color={text80}
                  fontWeight="400"
                  h="28px"
                  px="7.5px"
                  bg={boxBg6}
                  _hover={{border: bordersActive, bg: hover}}
                  transition="all 250ms ease-in-out"
                  fontSize={["12px", "12px", "13px", "14px"]}
                  as={Button}
                  rightIcon={<ChevronDownIcon pl="0px" mr="-2px" ml="-5px" />}
                >
                  {timeSelected}
                </MenuButton>
                <MenuList
                  py="5px"
                  minW="0px"
                  border={borders}
                  boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                  bg={boxBg6}
                  borderRadius="8px"
                >
                  {timestamps.map(time => (
                    <MenuItem
                      _hover={{color: text80}}
                      transition="all 250ms ease-in-out"
                      borderRadius="8px"
                      color={timeSelected === time ? text80 : text40}
                      py="5px"
                      fontSize={["12px", "12px", "13px", "14px"]}
                      bg={boxBg6}
                      key={time}
                      onClick={() => setUserTimeSelected(time)}
                    >
                      {time}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          <Flex direction="column" display={["flex"]}>
            <Flex
              h="7px"
              w={["100%", "100%", "100%", "50%"]}
              bg="#87878720"
              borderRadius="8px"
              mt="2.5px"
            >
              <Box
                borderRadius="8px"
                h="100%"
                bg={isUp ? "green" : "red"}
                w={
                  priceLow && priceHigh
                    ? `${
                        ((marketMetrics.price - priceLow) /
                          (priceHigh - priceLow)) *
                        100
                      }%`
                    : "0%"
                }
              />
            </Flex>
            <Flex
              justify="space-between"
              mt={["5px", "5px", "7.5px"]}
              w={["100%", "100%", "100%", "50%"]}
            >
              <Flex align="center">
                <TextSmall color={text60} mr="5px">
                  Low
                </TextSmall>
                <TextSmall color={text80} fontWeight="500">
                  ${getFormattedAmount(priceLow)}
                </TextSmall>
              </Flex>
              <Flex align="center">
                <TextSmall color={text60} mr="5px">
                  High
                </TextSmall>
                <TextSmall color={text80} fontWeight="500">
                  ${getFormattedAmount(priceHigh)}
                </TextSmall>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex
          h="7px"
          w={["100%", "100%", "100%", "50%"]}
          bg="#87878720"
          borderRadius="8px"
          mt={["10px", "10px", "25px"]}
        >
          <Box
            borderRadius="8px"
            h="100%"
            bg={isUp ? "green" : "red"}
            w={
              priceLow && priceHigh
                ? `${
                    ((marketMetrics.price - priceLow) /
                      (priceHigh - priceLow)) *
                    100
                  }%`
                : "0%"
            }
          />
        </Flex>
      )}
    </Flex>
  );
};
