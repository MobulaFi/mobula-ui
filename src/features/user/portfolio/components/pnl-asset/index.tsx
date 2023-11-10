import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useMediaQuery,
} from "@chakra-ui/react";
import { default as React, useContext, useEffect, useState } from "react";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextSmall,
} from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { timeframeOptions } from "../../constants";
import { PortfolioV2Context } from "../../context-manager";
import { boxStyle } from "../../style";
import { Privacy } from "../ui/privacy";
import { NetProfitAsset } from "./net-profit-asset";

export const PNLAsset = () => {
  const { wallet, setTimeframe, timeframe, asset, isLoading, manager } =
    useContext(PortfolioV2Context);
  const [showMorePnl, setShowMorePnl] = useState(false);
  const { borders, text10, hover, boxBg3, text80, text40, boxBg6 } =
    useColors();
  const [changeColor, setChangeColor] = useState(text80);

  const [isLargerThan480] = useMediaQuery("(min-width: 480px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  useEffect(() => {
    if (!wallet) return;
    if (wallet.estimated_balance_change === true) {
      setChangeColor("green");
      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    } else if (wallet.estimated_balance_change === false) {
      setChangeColor("red");
      setTimeout(() => {
        setChangeColor(text80);
      }, 1000);
    }
  }, [wallet]);

  const newWallet = wallet?.portfolio.filter(
    (entry) => entry.name === asset?.name
  )[0];

  const getPercentageOfBuyRange = () => {
    if (newWallet) {
      const minPriceBought = newWallet?.min_buy_price;
      const maxPriceBought = newWallet?.max_buy_price;
      const priceBought = newWallet?.price_bought;

      const priceRange = maxPriceBought - Number(minPriceBought);
      const priceDifference = priceBought - Number(minPriceBought);

      const result = (priceDifference * 100) / priceRange;
      return getFormattedAmount(result);
    }
    return 0;
  };

  return (
    <Flex
      {...boxStyle}
      border={borders}
      bg={boxBg3}
      mt={["10px", "10px", "10px", "0px"]}
      w={["100%", "100%", "100%", "320px"]}
      onClick={() => setShowMorePnl(!showMorePnl)}
    >
      <Flex justify="space-between">
        {isLoading ? (
          <Skeleton
            borderRadius="8px"
            h={["21px", "21px", "23px", "25px"]}
            w="100px"
            startColor={boxBg6}
            endColor={hover}
          />
        ) : (
          <TextLandingMedium color={text80} fontWeight="600">
            Holdings
          </TextLandingMedium>
        )}

        <Flex align="center">
          <Box display={["none", "none", "none", "block"]}>
            {isLoading ? (
              <Skeleton
                h="24px"
                w="60px"
                borderRadius="8px"
                startColor={boxBg6}
                endColor={hover}
              />
            ) : (
              <Menu matchWidth>
                <MenuButton
                  border={borders}
                  borderRadius="8px"
                  color={text80}
                  fontWeight="400"
                  h="24px"
                  px="7.5px"
                  bg={boxBg6}
                  fontSize={["12px", "12px", "13px", "14px"]}
                  as={Button}
                  rightIcon={<ChevronDownIcon pl="0px" mr="-2px" ml="-5px" />}
                >
                  {timeframe}
                </MenuButton>
                <MenuList
                  py="5px"
                  minW="0px"
                  border={borders}
                  boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                  bg={boxBg6}
                  borderRadius="8px"
                >
                  {timeframeOptions.map((time) => (
                    <MenuItem
                      _hover={{ color: { text80 } }}
                      transition="all 250ms ease-in-out"
                      borderRadius="8px"
                      color={timeframe === time ? text80 : text40}
                      py="5px"
                      fontSize={["12px", "12px", "13px", "14px"]}
                      bg={boxBg6}
                      onClick={() => setTimeframe(time)}
                    >
                      {time}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </Box>
          <NetProfitAsset
            display={["flex", "flex", "flex", "none"]}
            direction="row"
            align="center"
            changeColor={changeColor}
          />
          <Button
            ml="5px"
            mt="3px"
            display={["flex", "none"]}
            onClick={() => setShowMorePnl(!showMorePnl)}
          >
            <ChevronDownIcon
              transform={showMorePnl ? "rotate(180deg)" : "rotate(0deg)"}
              transition="all 250ms ease-in-out"
              fontSize="25px"
              color={text80}
            />
          </Button>
        </Flex>
      </Flex>
      <NetProfitAsset
        changeColor={changeColor}
        display={["none", "none", "none", "flex"]}
      />

      <Collapse
        in={showMorePnl && !isLargerThan480}
        startingHeight={isLargerThan480 ? "100%" : 0}
      >
        {timeframe !== "ALL" ? (
          <Flex
            mt="10px"
            py="10px"
            borderBottom={borders}
            justify="space-between"
            px="5px"
          >
            {isLoading ? (
              <Skeleton
                h={["12px", "12px", "13px", "14px"]}
                w="110px"
                borderRadius="8px"
                startColor={boxBg6}
                endColor={hover}
              />
            ) : (
              <TextSmall color={text40}>Realized PNL ({timeframe})</TextSmall>
            )}
            {isLoading ? (
              <Skeleton
                h={["12px", "12px", "13px", "14px"]}
                w="50px"
                borderRadius="8px"
                startColor={boxBg6}
                endColor={hover}
              />
            ) : (
              <TextSmall
                color={
                  asset?.relative_pnl_history?.[timeframe.toLowerCase()]
                    ?.realized > 0
                    ? "green"
                    : "red"
                }
              >
                {getFormattedAmount(
                  asset?.relative_pnl_history?.[timeframe.toLowerCase()]
                    ?.realized
                )}
                $
              </TextSmall>
            )}
          </Flex>
        ) : null}
        <Flex py="10px" borderBottom={borders} justify="space-between" px="5px">
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="110px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={text40}>Realized PNL</TextSmall>
          )}
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="50px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={asset?.realized_usd > 0 ? "green" : "red"}>
              {getFormattedAmount(asset?.realized_usd)}$
            </TextSmall>
          )}
        </Flex>
        <Flex py="10px" borderBottom={borders} justify="space-between" px="5px">
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="110px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={text40}>Unrealized PNL</TextSmall>
          )}

          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="50px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={asset?.unrealized_usd > 0 ? "green" : "red"}>
              {getFormattedAmount(asset?.unrealized_usd)}$
            </TextSmall>
          )}
        </Flex>
        <Flex py="10px" borderBottom={borders} justify="space-between" px="5px">
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="110px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={text40}>Avg price bought</TextSmall>
          )}
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="50px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <TextSmall color={text80}>
              {getFormattedAmount(newWallet?.price_bought)}$
            </TextSmall>
          )}
        </Flex>
        <Flex
          pt="10px"
          justify="space-between"
          px="5px"
          align="center"
          pb={["30px", "30px", "20px"]}
        >
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="110px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
              mb="-15px"
            />
          ) : (
            <TextSmall color={text40} mb="-15px">
              Buy price range
            </TextSmall>
          )}
          {isLoading ? (
            <Flex direction="column" w="150px" mb="-15px">
              <Skeleton
                w="150px"
                h="3px"
                startColor={boxBg6}
                borderRadius="full"
                endColor={hover}
              />
              <Flex w="100%" align="center" justify="space-between">
                <Skeleton
                  h={["10px", "10px", "11px", "12px"]}
                  w="30px"
                  borderRadius="8px"
                  mt="5px"
                  startColor={boxBg6}
                  endColor={hover}
                />
                <Skeleton
                  h={["10px", "10px", "11px", "12px"]}
                  w="30px"
                  borderRadius="8px"
                  mt="5px"
                  startColor={boxBg6}
                  endColor={hover}
                />
              </Flex>
            </Flex>
          ) : (
            <Flex
              position="relative"
              w="150px"
              h="3px"
              borderRadius="full"
              bg={text10}
            >
              <Flex
                h="100%"
                bg="green"
                w={`${getPercentageOfBuyRange()}%`}
                borderRadius="full"
              />
              <TextExtraSmall position="absolute" left="0px" bottom="-22.5px">
                ${getFormattedAmount(newWallet?.min_buy_price)}
              </TextExtraSmall>
              <TextExtraSmall position="absolute" right="0px" bottom="-22.5px">
                ${getFormattedAmount(newWallet?.max_buy_price)}
              </TextExtraSmall>
            </Flex>
          )}
        </Flex>
        <Flex
          pt="10px"
          mt="10px"
          borderTop={borders}
          justify="space-between"
          px="5px"
        >
          {isLoading ? (
            <Skeleton
              h={["12px", "12px", "13px", "14px"]}
              w="110px"
              borderRadius="8px"
              startColor={boxBg6}
              endColor={hover}
            />
          ) : (
            <Flex align="center">
              <TextSmall color={text40}>Total invested</TextSmall>
              <InfoPopup
                info="Total volume out of the portfolio - can be high if trading
                in/out."
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                position={"right" as any}
              />
            </Flex>
          )}

          {manager.privacy_mode ? (
            <Privacy />
          ) : (
            <Flex>
              {isLoading ? (
                <Skeleton
                  h={["12px", "12px", "13px", "14px"]}
                  w="50px"
                  borderRadius="8px"
                  startColor={boxBg6}
                  endColor={hover}
                />
              ) : (
                <TextSmall color={text80}>
                  {getFormattedAmount(asset?.total_invested)}$
                </TextSmall>
              )}
            </Flex>
          )}
        </Flex>
      </Collapse>
    </Flex>
  );
};
