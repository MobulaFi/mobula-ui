/* eslint-disable no-fallthrough */
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useContext, useEffect, useState} from "react";
import {FiFilter} from "react-icons/fi";
import {useAccount} from "wagmi";
import {
  getClosest,
  getFormattedAmount,
} from "../../../../../../../../utils/helpers/formaters";
import {UserTrade} from "../../../../../../../../utils/interfaces/typescript";
import {
  TextLandingMedium,
  TextMedium,
  TextSmall,
} from "../../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {PopupUpdateContext} from "../../../../../../../common/context-manager/popup";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../../common/utils/fetch";
import {BaseAssetContext} from "../../../../context-manager";
import {Trade} from "../../../../models";
import {formatFilters} from "../../../../utils";
import {TradeBlockchainPopup} from "../../../popup/trade-blockchain-selector";
import {TradeTypePopup} from "../../../popup/trade-type";
import {TradeValueAmountPopup} from "../../../popup/trade-value-amount";
import {PopoverTrade} from "../../../ui/popover-trade";
import {Ths} from "../../../ui/td";

export const TokenTrades = () => {
  const {setConnect} = useContext(PopupUpdateContext);
  const {
    setShowTradeFilters,
    marketMetrics,
    isMarketMetricsLoading,
    setShowTradeValue,
    showTradeValue,
    setShowTradeTokenAmount,
    showTradeTokenAmount,
    filters,
    baseAsset,
  } = useContext(BaseAssetContext);
  const {address} = useAccount();
  const [userTrades, setUserTrades] = useState(null);
  const [isMyTrades, setIsMyTrades] = useState<boolean>(false);
  const maxValue = 1_000_000_000_000;
  const {
    text80,
    hover,
    boxBg6,
    borders,
    text40,
    text60,
    text10,
    bordersActive,
    boxBg3,
  } = useColors();
  const titles: string[] = [
    "Type",
    "Tokens",
    "Value",
    "Price",
    "Time",
    "Explorer",
  ];
  const {isConnected, isDisconnected} = useAccount();
  const getDefaultName = title => {
    let newValue = "";
    const defaultValue = [0, maxValue];
    let tokenAmounts = [...defaultValue];
    let valueUsd = [...defaultValue];

    filters.forEach(filter => {
      const name = filter.value?.[0]?.split("trade_history")[1].split(".")[1];
      const value = filter.value?.[1];
      switch (name) {
        case "token_amount": {
          if (title === "token_amount") {
            if (filter.action === "gte" && tokenAmounts[0] === value) {
              tokenAmounts = [tokenAmounts[0], tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "gte" && tokenAmounts[0] !== value) {
              tokenAmounts = [value, tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "lte" && tokenAmounts[1] === value) {
              tokenAmounts = [tokenAmounts[0], tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "lte" && tokenAmounts[1] !== value) {
              tokenAmounts = [tokenAmounts[0], value];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else newValue = "Any Amount";
            return newValue;
          }
          break;
        }
        case "value_usd": {
          if (title === "value_usd") {
            if (filter.action === "gte" && valueUsd[0] === value) {
              valueUsd = [valueUsd[0], valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "gte" && valueUsd[0] !== value) {
              valueUsd = [value, valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "lte" && valueUsd[1] === value) {
              valueUsd = [valueUsd[0], valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "lte" && valueUsd[1] !== value) {
              valueUsd = [valueUsd[0], value];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else newValue = "Any Amount";
            return newValue;
          }
          break;
        }
        case "type": {
          if (title === "type") {
            const text = filter.value?.[1];
            newValue = `${text.charAt(0).toUpperCase()}${text.slice(1)} Tx`;
          }
          break;
        }
        default:
          return "All";
      }
      return newValue;
    });

    if (newValue.includes(maxValue.toString()))
      newValue = newValue.replace(maxValue.toString(), "Any");

    return newValue;
  };

  const [activeNames, setActiveNames] = useState({
    liquidity_pool: "Any Liquidity Pool",
    blockchain: "All Chains",
    type: getDefaultName("type") || "Any Type",
    token_amount: getDefaultName("token_amount") || "Any Amount",
    value: getDefaultName("value_usd") || "Any Value",
  });
  const filterFormatted = formatFilters(filters);

  useEffect(() => {
    if (filters.length > 0) Cookies.set("trade-filters", filterFormatted);
  }, [filters]);

  const getPositionOfSwitcherButton = (myTrade: boolean) => {
    if (myTrade) return "calc(50% - 2px)";
    return "calc(0% + 2px)";
  };

  useEffect(() => {
    GET("/api/1/wallet/transactions", {
      asset: baseAsset.name,
      wallet: address,
      limit: 25,
      order: "desc",
    })
      .then(r => r.json())
      .then(r => {
        if (r.data) setUserTrades(r.data.transactions);
      });
  }, []);

  return (
    <Flex
      direction="column"
      mt={["20px", "20px", "20px", "20px"]}
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
    >
      <Flex align="center" justify="space-between">
        <TextLandingMedium>Live Trades</TextLandingMedium>
      </Flex>

      <Flex
        justify="space-between"
        align="center"
        mb="10px"
        mt="10px"
        overflowX="scroll"
        className="scroll"
        display={["none", "none", "none", "flex"]}
      >
        <Flex
          minH="45px"
          align="center"
          opacity={isMyTrades ? 0.5 : 1}
          transition="all 150ms ease-in-out"
        >
          {/* <PopoverTrade title={activeNames.liquidity_pool}>
            <TradeLiquidityPoolPopup />
          </PopoverTrade> */}
          <PopoverTrade
            title={activeNames.blockchain}
            isImage={activeNames.blockchain !== "All Chains"}
          >
            <TradeBlockchainPopup setActiveName={setActiveNames} />
          </PopoverTrade>
          <PopoverTrade title={activeNames.type}>
            <TradeTypePopup setActiveName={setActiveNames} />
          </PopoverTrade>
          <PopoverTrade title={activeNames.token_amount}>
            <TradeValueAmountPopup
              title="token_amount"
              state={showTradeTokenAmount}
              setActiveName={setActiveNames}
              setStateValue={setShowTradeTokenAmount}
              activeName={activeNames}
            />
          </PopoverTrade>
          <PopoverTrade title={activeNames.value}>
            <TradeValueAmountPopup
              title="Value"
              setActiveName={setActiveNames}
              state={showTradeValue}
              setStateValue={setShowTradeValue}
              activeName={activeNames}
            />
          </PopoverTrade>
        </Flex>
        <Flex
          h="35px"
          align="center"
          bg={boxBg6}
          position="relative"
          px="8px"
          borderRadius="8px"
          w="200px"
          display={["none", "none", "none", "flex"]}
          border={borders}
        >
          <Flex
            w="50% "
            h="29px"
            bg={hover}
            borderRadius="6px"
            position="absolute"
            transition="all 250ms ease-in-out"
            left={getPositionOfSwitcherButton(isMyTrades)}
          />
          <Button
            w="50%"
            h="29px"
            px="10px"
            fontSize={["12px", "12px", "13px", "14px"]}
            color={!isMyTrades ? text80 : text40}
            fontWeight="500"
            transition="all 250ms ease-in-out"
            onClick={() => {
              setIsMyTrades(false);
              if (!isDisconnected) setConnect(true);
            }}
          >
            All trades
          </Button>
          <Button
            w="50%"
            px="10px"
            h="30px"
            fontSize={["12px", "12px", "13px", "14px"]}
            color={isMyTrades ? text80 : text40}
            fontWeight="500"
            transition="all 250ms ease-in-out"
            onClick={() => setIsMyTrades(true)}
          >
            My Trades
          </Button>
        </Flex>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        display={["flex", "flex", "flex", "none"]}
        my="10px"
      >
        <Button
          maxW="fit-content"
          px="12px"
          h="32px"
          borderRadius="8px"
          bg={boxBg6}
          border={borders}
          _hover={{
            border: bordersActive,
            bg: hover,
          }}
          transition="all 250ms ease-in-out"
          color={text80}
          fontWeight="400"
          fontSize={["12px", "12px", "13px", "14px"]}
          onClick={() => setShowTradeFilters(true)}
        >
          <Icon as={FiFilter} mr="7.5px" />
          Filters
        </Button>
        <Flex
          h="32px"
          align="center"
          bg={boxBg6}
          position="relative"
          px="8px"
          borderRadius="8px"
          w="180px"
          border={borders}
        >
          <Flex
            w="50%"
            h="26px"
            bg={hover}
            borderRadius="6px"
            position="absolute"
            transition="all 250ms ease-in-out"
            left={getPositionOfSwitcherButton(isMyTrades)}
          />
          <Button
            w="50%"
            h="26px"
            fontSize={["12px", "12px", "13px", "14px"]}
            color={!isMyTrades ? text80 : text40}
            fontWeight="400"
            transition="all 250ms ease-in-out"
            onClick={() => {
              setIsMyTrades(false);
              if (!isConnected) setConnect(true);
            }}
          >
            All trades
          </Button>
          <Button
            w="50%"
            h="30px"
            fontSize={["12px", "12px", "13px", "14px"]}
            color={isMyTrades ? text80 : text40}
            fontWeight="400"
            transition="all 250ms ease-in-out"
            onClick={() => setIsMyTrades(true)}
          >
            My Trades
          </Button>
        </Flex>
      </Flex>
      <Box h="100%" w="100%" mx="auto">
        <TableContainer overflowY="scroll" className="scroll" maxH="480px">
          <Table variant="simple" position="relative" overflowX="scroll">
            {!isMarketMetricsLoading &&
            isMyTrades &&
            (userTrades?.length || 0) === 0 ? (
              <TableCaption
                border={borders}
                mt="0px"
                borderRadius="0px 0px 8px 8px"
                borderTop="none"
              >
                <Flex
                  h="250px"
                  w="100%"
                  align="center"
                  direction="column"
                  justify="center"
                >
                  <Image src="/404/ray.png" />
                  <TextMedium
                    color={text60}
                    fontWeight="500"
                    mt="20px"
                    mb="10px"
                  >
                    You don&apos;t have any trades
                  </TextMedium>
                </Flex>
              </TableCaption>
            ) : null}
            {isMarketMetricsLoading ? (
              <TableCaption
                border={borders}
                mt="0px"
                borderRadius="0px 0px 8px 8px"
                borderTop="none"
              >
                <Flex
                  h="250px"
                  w="100%"
                  align="center"
                  direction="column"
                  justify="center"
                >
                  <Spinner
                    thickness="6px"
                    speed="0.65s"
                    emptyColor={text10}
                    color="blue"
                    size="xl"
                  />
                </Flex>
              </TableCaption>
            ) : null}
            {!isMarketMetricsLoading &&
            marketMetrics?.trade_history?.length === 0 &&
            !isMyTrades ? (
              <TableCaption
                border={borders}
                mt="0px"
                borderRadius="0px 0px 8px 8px"
                borderTop="none"
              >
                <Flex
                  h="250px"
                  w="100%"
                  align="center"
                  direction="column"
                  justify="center"
                >
                  <Image src="/404/ray.png" />
                  <TextMedium
                    color={text60}
                    fontWeight="500"
                    mt="20px"
                    mb="10px"
                  >
                    No trades available
                  </TextMedium>
                </Flex>
              </TableCaption>
            ) : null}
            <Thead>
              <Tr>
                {titles
                  .filter(entry => entry !== "Unit Price")
                  .map((entry, i) => {
                    const isFirst = i === 0;
                    const isLast = i === titles.length - 1;
                    const isExplorer = entry === "Explorer";
                    return (
                      <Ths
                        key={entry}
                        position="sticky"
                        zIndex="2"
                        top="-1px"
                        bg={boxBg3}
                        borderTop={borders}
                        borderBottom={borders}
                        px="10px"
                        py="13px"
                        pl={["10px", "10px", isFirst ? "20px" : "10px"]}
                        pr={[
                          "10px",
                          "10px",
                          isLast || isExplorer ? "20px" : "10px",
                        ]}
                        textAlign={isFirst ? "start" : "end"}
                        display={[
                          entry === "Unit Price" || entry === "Value"
                            ? "none"
                            : "table-cell",
                          entry === "Unit Price" || entry === "Value"
                            ? "none"
                            : "table-cell",
                          "table-cell",
                          "table-cell",
                        ]}
                      >
                        <TextSmall>{entry}</TextSmall>
                      </Ths>
                    );
                  })}
              </Tr>
            </Thead>
            {(isMyTrades
              ? userTrades?.filter(entry => entry.amount > 0)
              : marketMetrics?.trade_history
            )?.map((trade: Trade | UserTrade) => {
              const isSell = trade.type === "sell";
              const date = isMyTrades ? trade?.timestamp : trade?.date;
              return (
                <Tbody
                  key={
                    trade.date +
                    trade.value_usd +
                    trade.token_amount +
                    trade.type +
                    (trade?.hash || 0) +
                    (trade?.unique_discriminator || 0) +
                    (trade?.id || 0)
                  }
                >
                  <Tr>
                    <Td
                      borderBottom={borders}
                      pl={["10px", "10px", "20px"]}
                      pr="10px"
                      py="5px"
                      fontSize={["8px", "8px", "10px", "11px"]}
                    >
                      <Box>
                        <TextSmall
                          mb={["-5px", "-5px", "-2px"]}
                          color={isSell ? "red" : "green"}
                        >
                          {isSell ? "Sell" : "Buy"}
                        </TextSmall>
                      </Box>
                    </Td>
                    <Td
                      borderBottom={borders}
                      px="10px"
                      pr={["10px", "10px", "20px"]}
                    >
                      <Flex
                        align="end"
                        w="100%"
                        justify="center"
                        direction="column"
                      >
                        {"blockchain" in trade || isMyTrades ? (
                          <TextSmall fontWeight="500">
                            <NextChakraLink
                              isExternal
                              href={
                                "blockchain" in trade && "hash" in trade
                                  ? `${
                                      blockchainsContent[trade.blockchain]
                                        .explorer
                                    }/tx/${trade.hash}`
                                  : "/"
                              }
                              key={trade.hash}
                              target="_blank"
                              color={text80}
                            >
                              {getFormattedAmount(
                                isMyTrades ? trade.amount : trade.token_amount,
                              )}
                            </NextChakraLink>
                          </TextSmall>
                        ) : null}
                        <Text
                          fontWeight="500"
                          m="0px"
                          mt="-4px"
                          color={isSell ? "red" : "green"}
                          fontSize={["11px", "11px", "12px", "13px"]}
                          mr={["0px", "0px", "10px", "0px"]}
                          display={["flex", "flex", "none"]}
                        >
                          $
                          {getFormattedAmount(
                            isMyTrades ? trade.amount_usd : trade.value_usd,
                            2,
                          )}
                        </Text>
                      </Flex>
                    </Td>

                    <Td
                      borderBottom={borders}
                      px="10px"
                      display={["none", "none", "table-cell"]}
                    >
                      <Flex justify="flex-end" w="100%" minWidth="60px">
                        <Text
                          color={isSell ? "red" : "green"}
                          fontSize={["11px", "11px", "12px", "13px"]}
                          mr={["0px", "0px", "10px", "0px"]}
                        >
                          $
                          {getFormattedAmount(
                            isMyTrades ? trade.amount_usd : trade.value_usd,
                            2,
                          )}
                        </Text>
                      </Flex>
                    </Td>
                    <Td borderBottom={borders} px="10px" minWidth="90px">
                      <Flex justify="flex-end" w="100%">
                        <Text
                          textAlign="end"
                          color={isSell ? "red" : "green"}
                          fontSize={["11px", "11px", "12px", "13px"]}
                        >
                          {`$${getFormattedAmount(
                            isMyTrades
                              ? getClosest(
                                  baseAsset?.price_history?.price,
                                  trade?.timestamp,
                                )
                              : trade.token_price,
                          )}`}
                        </Text>
                      </Flex>{" "}
                    </Td>
                    <Td
                      borderBottom={borders}
                      px="10px"
                      pl={["10px", "10px", "20px"]}
                      isNumeric
                    >
                      <Flex align="end" direction="column">
                        <TextSmall fontSize="12px" fontWeight="500">
                          {new Date(date).getHours() > 9
                            ? new Date(date).getHours()
                            : `0${new Date(date).getHours()}`}
                          :
                          {new Date(date).getMinutes() > 9
                            ? new Date(date).getMinutes()
                            : `0${new Date(date).getMinutes()}`}
                          :
                          {new Date(date).getSeconds() > 9
                            ? new Date(date).getSeconds()
                            : `0${new Date(date).getSeconds()}`}
                        </TextSmall>
                        {isMyTrades ? (
                          <TextSmall fontSize="12px" fontWeight="500">
                            {trade.date}
                          </TextSmall>
                        ) : null}{" "}
                      </Flex>
                    </Td>
                    <Td
                      borderBottom={borders}
                      px="10px"
                      pr={["10px", "10px", "20px"]}
                    >
                      <Flex
                        align="center"
                        justify={["flex-start", "flex-start", "flex-end"]}
                        w="100%"
                      >
                        {"blockchain" in trade || isMyTrades ? (
                          <>
                            {" "}
                            <NextChakraLink
                              isExternal
                              href={
                                "blockchain" in trade && "hash" in trade
                                  ? `${
                                      blockchainsContent[trade.blockchain]
                                        .explorer
                                    }/tx/${trade.hash}`
                                  : "/"
                              }
                              key={trade.hash}
                              target="_blank"
                            >
                              <ExternalLinkIcon
                                color={text40}
                                ml={["0px", "0px", "15px"]}
                                mb="3px"
                                mr="7.5px"
                              />
                            </NextChakraLink>
                            <Image
                              src={
                                blockchainsContent[trade.blockchain]?.logo ||
                                `/logo/${
                                  trade.blockchain.toLowerCase().split(" ")[0]
                                }.png`
                              }
                              boxSize="18px"
                              minWidth="18px"
                              mb="2px"
                              width="18px"
                              borderRadius="50%"
                            />
                          </>
                        ) : null}
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              );
            })}
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};
