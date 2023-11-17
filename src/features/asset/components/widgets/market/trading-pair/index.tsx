/* eslint-disable no-unsafe-optional-chaining */
import {CheckIcon, CopyIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useRouter} from "next/router";
import {useContext, useEffect, useRef, useState} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {
  TextLandingMedium,
  TextMedium,
  TextSmall,
} from "../../../../../../../UI/Text";
import {famousContractsLabelFromName} from "../../../../../../../common/providers/swap/utils";
import {LoadMore} from "../../../../../../../common/ui/load-more-table";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../../common/utils/fetch";
import {addressSlicer} from "../../../../../../../common/utils/user";
import {BaseAssetContext} from "../../../../context-manager";
import {IPairs} from "../../../../models";
import {Ths} from "../../../ui/td";

export const TradingPairs = () => {
  const {borders, text60, boxBg6, text80, hover, text40, boxBg3} = useColors();
  const {baseAsset, setPairs, pairs} = useContext(BaseAssetContext);
  const [isLoading, setIsLoading] = useState(!pairs?.length);
  const router = useRouter();
  const [isCopied, setIsCopied] = useState("");
  const [activePairs, setActivePairs] = useState("dex");
  const [page, setPage] = useState(0);
  const [isTradeScrollLoading, setIsTradeScrollLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPairs, setTotalPairs] = useState(0);
  const titles = [
    "DEX",
    "Trading Pairs",
    "Liquidity",
    "Price",
    "Pairs Address",
  ];

  const fetchTrades = () => {
    setIsTradeScrollLoading(true);
    GET("/api/1/market/pairs", {
      asset: baseAsset?.name,
      offset: page,
      hideBrokenPairs: true,
    })
      .then(r => r.json())
      .then(({data}) => {
        if (data && data.pairs.length > 0) {
          setPairs(prevTrades => [...prevTrades, ...data.pairs]);
          setTotalPairs(data.total_count);
          setPage(prevPage => prevPage + 1);
          setIsTradeScrollLoading(false);
          setIsLoading(false);
          if (pairs?.length > 0)
            containerRef.current?.scrollTo({
              top: containerRef.current?.scrollHeight * data.pairs.length + 51,
              behavior: "smooth",
            });
        } else {
          console.log("ERROR:", data);
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!pairs?.length || pairs?.length === 0) {
      fetchTrades();
    } else setIsLoading(false);
  }, [baseAsset]);

  const copyText = pair => {
    window.navigator.clipboard.writeText(pair?.address);
    window.focus();
    setIsCopied(pair.address);
    setTimeout(() => {
      setIsCopied("");
    }, 2000);
  };

  const newPairs: IPairs[] = pairs;

  const getPositionFromPair = pair => {
    switch (pair) {
      case "all":
        return "calc(0% + 2px)";
      case "cex":
        return "calc(33.33% + 2px)";
      case "dex":
        return "calc(66.66% + 2px)";
      default:
        return "calc(0% + 2px)";
    }
  };

  const fetchMoreTrades = async () => {
    fetchTrades();
  };

  const getSymbol = pair => {
    if (pair.token1.symbol === baseAsset?.symbol) return pair.token0.symbol;
    return pair.token1.symbol;
  };

  return (
    <Flex
      direction="column"
      mt={["5px", "5px", "20px", "0px"]}
      mb="20px"
      w="100%"
      display={newPairs?.length > 0 || isLoading ? "flex" : "none"}
    >
      <Flex
        align="center"
        mb="15px"
        justify="space-between"
        pr={["7.5px", "7.5px", "0px"]}
      >
        <TextLandingMedium
          fontSize={["16px", "16px", "16px", "18px"]}
          ml={["10px", "10px", "0px"]}
        >
          Trading Pairs
        </TextLandingMedium>
        <Flex
          bg={boxBg6}
          border={borders}
          borderRadius="8px"
          p="2px"
          h={["31px", "31px", "36px"]}
          position="relative"
          maxW="200px"
          w="100%"
        >
          <Flex
            h={["25px", "25px", "30px"]}
            bg={hover}
            w="calc(33.33% - 4px)"
            borderRadius="6px"
            position="absolute"
            left={getPositionFromPair(activePairs)}
            transition="all 250ms ease-in-out"
          />
          <Button
            w="33.33%"
            h={["25px", "25px", "30px"]}
            onClick={() => setActivePairs("all")}
            isDisabled
          >
            <TextSmall
              color={activePairs === "all" ? text80 : text40}
              fontWeight="500"
              transition="all 250ms ease-in-out"
            >
              All
            </TextSmall>
          </Button>
          <Button
            w="33.33%"
            h={["25px", "25px", "30px"]}
            onClick={() => setActivePairs("cex")}
            isDisabled
          >
            <TextSmall
              color={activePairs === "cex" ? text80 : text40}
              fontWeight="500"
              transition="all 250ms ease-in-out"
            >
              CEX
            </TextSmall>
          </Button>
          <Button
            w="33.33%"
            h={["25px", "25px", "30px"]}
            onClick={() => setActivePairs("dex")}
          >
            <TextSmall
              fontWeight="500"
              transition="all 250ms ease-in-out"
              color={activePairs === "dex" ? text80 : text40}
            >
              DEX
            </TextSmall>
          </Button>
        </Flex>
      </Flex>
      <TableContainer
        maxH={["430px", "430px", "500px"]}
        overflowY="scroll"
        className="scroll"
        ref={containerRef}
        position="relative"
      >
        <Table
          variant="simple"
          position="relative"
          maxH={["350px", "350px", "500px"]}
        >
          <Thead>
            <Tr>
              {titles
                .filter(entry => entry !== "Unit Price")
                .map((entry, i) => {
                  const isFirst = i === 0;
                  const isLast = i === titles.length - 1;
                  const isOpen = entry === "Open";
                  return (
                    <Ths
                      key={entry}
                      position="sticky"
                      bg={boxBg3}
                      zIndex="2"
                      top="-1px"
                      borderTop={borders}
                      borderBottom={borders}
                      px="10px"
                      py="13px"
                      pl={["10px", "10px", isFirst ? "20px" : "10px"]}
                      pr={["10px", "10px", isLast || isOpen ? "20px" : "10px"]}
                      textAlign={
                        isFirst || entry === "Trading Pairs" ? "start" : "end"
                      }
                      display={[
                        entry === "Unit Price" ? "none" : "table-cell",
                        entry === "Unit Price" ? "none" : "table-cell",
                        "table-cell",
                        "table-cell",
                      ]}
                    >
                      {entry === "Pairs Address" ? (
                        <Flex align="center" justify="end">
                          <TextSmall
                            fontWeight="500"
                            textAlign="end"
                            display={["none", "none", "flex"]}
                          >
                            {entry}
                          </TextSmall>
                          <TextSmall
                            fontWeight="500"
                            textAlign="end"
                            display={["flex", "flex", "none"]}
                          >
                            Link
                          </TextSmall>
                        </Flex>
                      ) : (
                        <TextSmall fontWeight="500">{entry}</TextSmall>
                      )}
                    </Ths>
                  );
                })}
            </Tr>
          </Thead>
          {newPairs?.length > 0 || isLoading ? (
            <>
              <Tbody>
                {(pairs?.length > 0
                  ? pairs?.sort((a, b) => b.liquidity - a.liquidity)
                  : Array.from({length: 8})
                )?.map((pair: IPairs, i: number) => {
                  const geckoId =
                    blockchainsContent[pair?.blockchain]?.geckoterminalChain;
                  const geckoUrl = geckoId
                    ? `https://www.geckoterminal.com/${geckoId}/pools/${pair.address}`
                    : "";
                  return (
                    <Tr
                      key={
                        pair?.exchange + pair?.address + pair?.liquidity || i
                      }
                    >
                      <Td
                        borderBottom={borders}
                        py="5px"
                        pl={["10px", "10px", "20px"]}
                        pr={["25px", "25px", "10px"]}
                        fontSize={["8px", "8px", "10px", "11px"]}
                      >
                        {isLoading ? (
                          <Flex align="center">
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              h="20px"
                              borderRadius="4px"
                              w="120px"
                            />
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              boxSize="23px"
                              borderRadius="full"
                              ml="10px"
                            />
                          </Flex>
                        ) : (
                          <Flex align="center" justify={["center", "start"]}>
                            <Image
                              src={
                                famousContractsLabelFromName?.[pair?.exchange]
                                  ?.logo
                              }
                              fallbackSrc="/icon/unknown.png"
                              boxSize={["18px", "18px", "23px"]}
                              borderRadius="full"
                              mr={["5px", "5px", "10px"]}
                            />
                            <TextSmall
                              fontWeight="500"
                              display={["none", "flex"]}
                            >
                              {pair?.exchange || "Unknown"}
                            </TextSmall>
                          </Flex>
                        )}
                      </Td>
                      <Td
                        borderBottom={borders}
                        px="10px"
                        py="5px"
                        textAlign="start"
                        fontSize={["8px", "8px", "10px", "11px"]}
                      >
                        <Flex w="100%">
                          {isLoading ? (
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              h="20px"
                              borderRadius="4px"
                              w="120px"
                            />
                          ) : (
                            <TextSmall
                              mb={["-5px", "-5px", "-2px"]}
                              fontWeight="500"
                              color="blue"
                            >
                              {`${baseAsset?.symbol}/`}
                              {getSymbol(pair) || "--"}
                            </TextSmall>
                          )}
                        </Flex>
                      </Td>
                      <Td borderBottom={borders} px="10px" isNumeric>
                        <Flex justify="flex-end" w="100%">
                          {isLoading ? (
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              h="20px"
                              borderRadius="4px"
                              w="120px"
                            />
                          ) : (
                            <TextSmall
                              fontWeight="500"
                              mb={["-5px", "-5px", "-2px"]}
                            >
                              ${getFormattedAmount(pair.liquidity)}
                            </TextSmall>
                          )}
                        </Flex>
                      </Td>
                      <Td
                        borderBottom={borders}
                        px="10px"
                        textAlign="end"
                        isNumeric
                      >
                        <Flex justify="flex-end" w="100%">
                          {isLoading ? (
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              h="20px"
                              borderRadius="4px"
                              w="80px"
                            />
                          ) : (
                            <TextSmall
                              fontWeight="500"
                              mb={["-5px", "-5px", "-2px"]}
                            >
                              ${getFormattedAmount(pair.price)}
                            </TextSmall>
                          )}
                        </Flex>
                      </Td>
                      <Td borderBottom={borders} px="10px">
                        <Flex
                          justify="flex-end"
                          w="100%"
                          display={["none", "none", "flex"]}
                        >
                          {isLoading ? (
                            <Skeleton
                              startColor={boxBg6}
                              endColor={hover}
                              h="20px"
                              borderRadius="4px"
                              w="100px"
                            />
                          ) : (
                            <Flex
                              align="center"
                              onClick={() => copyText(pair)}
                              cursor="pointer"
                            >
                              <TextSmall
                                fontWeight="500"
                                mb={["-5px", "-5px", "-2px"]}
                              >
                                {addressSlicer(pair.address)}
                              </TextSmall>
                              {isCopied === pair.address ? (
                                <CheckIcon
                                  ml="10px"
                                  color="green"
                                  fontSize={["12px", "12px", "13px", "14px"]}
                                />
                              ) : (
                                <CopyIcon
                                  ml="10px"
                                  color={text80}
                                  fontSize={["12px", "12px", "13px", "14px"]}
                                />
                              )}
                            </Flex>
                          )}
                        </Flex>
                        <Flex
                          display={["flex", "flex", "none"]}
                          onClick={() => router.push(geckoUrl)}
                        >
                          <ExternalLinkIcon color={text60} mr="auto" />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              {hasMoreData && totalPairs !== pairs?.length ? (
                <LoadMore
                  position="sticky"
                  w="100%"
                  bottom="0px"
                  zIndex={1}
                  callback={() => {
                    fetchMoreTrades();
                  }}
                  isLoading={isTradeScrollLoading}
                  totalCount={totalPairs}
                  count={pairs?.length}
                />
              ) : null}
            </>
          ) : (
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
                <TextMedium color={text60} fontWeight="500" mt="20px" mb="10px">
                  No trading pairs detected for this token.
                </TextMedium>
              </Flex>
            </TableCaption>
          )}
        </Table>
      </TableContainer>
    </Flex>
  );
};
