import {
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {GET} from "../../../../../../../common/utils/fetch";
import {TagPercentage} from "../../../../../../User/Portfolio/components/ui/tag-percentage";
import {BaseAssetContext} from "../../../../context-manager";

export const TokenVersusMarket = () => {
  const {borders, hover, boxBg6} = useColors();
  const {baseAsset, tokenVsMarket, setTokenVsMarket} =
    useContext(BaseAssetContext);
  const titles = ["Entity", "24h", "7d", "30d"];
  const {boxBg3} = useColors();
  const [isLoading, setIsLoading] = useState(!tokenVsMarket);

  const getPercentageChange = (time, categorie) => {
    const isBTC = categorie?.name === "Bitcoin";
    switch (time) {
      case "1h": {
        if (isBTC) {
          return (
            (baseAsset?.price_change_1h || 1) -
            (categorie?.price_change_1h || 1)
          );
        }
        return (
          (baseAsset?.price_change_1h || 1) /
          (categorie?.market_cap_change_1h || 1)
        );
      }
      case "24h": {
        if (isBTC)
          return (
            (baseAsset?.price_change_24h || 1) -
            (categorie?.price_change_24h || 1)
          );
        return (
          (baseAsset?.price_change_24h || 1) -
          (categorie?.market_cap_change_24h || 1)
        );
      }
      case "7d": {
        if (isBTC)
          return (
            (baseAsset?.price_change_7d || 1) -
            (categorie?.price_change_7d || 1)
          );
        return (
          (baseAsset?.price_change_7d || 1) -
          (categorie?.market_cap_change_7d || 1)
        );
      }
      case "1m": {
        if (isBTC)
          return (
            (baseAsset?.price_change_1m || 1) -
            (categorie?.price_change_1m || 1)
          );
        return (
          (baseAsset?.price_change_1m || 1) -
          (categorie?.market_cap_change_1m || 1)
        );
      }
      default:
        return (
          (baseAsset?.price_change_1m || 1) -
          (categorie?.market_cap_change_1m || 1)
        );
    }
  };

  useEffect(() => {
    if (baseAsset)
      GET("/api/1/market/token-vs-market", {
        tag: baseAsset?.tags?.[0],
      })
        .then(r => r.json())
        .then(({data}) => {
          if (data) setTokenVsMarket(data);
          setIsLoading(false);
        });
  }, [baseAsset]);

  const getStateOfMarket = () => {
    if (!tokenVsMarket)
      return {
        bg: "darkyellow",
        color: "yellow",
        state: "Neutral",
      };

    const feeling = {
      neutral: 0,
      bullish: 0,
      bearish: 0,
    };

    tokenVsMarket
      .filter(entry => entry?.symbol !== baseAsset?.symbol && entry)
      .forEach(market => {
        const changes = [
          getPercentageChange("1h", market),
          getPercentageChange("24h", market),
          getPercentageChange("7d", market),
          getPercentageChange("1m", market),
        ];

        changes.forEach(change => {
          if (change > 0) feeling.bullish += 1;
          else if (change < 0) feeling.bearish += 1;
          else if (change === 0) feeling.neutral += 1;
        });
      });

    if (feeling.bullish > feeling.bearish && feeling.bullish > feeling.neutral)
      return {
        bg: "darkgreen",
        color: "green",
        state: "Bullish",
      };
    if (feeling.bearish > feeling.bullish && feeling.bearish > feeling.neutral)
      return {
        bg: "red_bg",
        color: "red",
        state: "Bearish",
      };
    return {
      bg: "darkyellow",
      color: "yellow",
      state: "Neutral",
    };
  };

  const stateOfMarket = getStateOfMarket();

  return (
    <Flex direction="column" mt="20px" w="100%">
      <Flex align="center" mb="15px">
        <TextLandingMedium
          fontSize={["16px", "16px", "16px", "18px"]}
          ml={["10px", "10px", "0px"]}
        >
          {baseAsset.name} vs Market
        </TextLandingMedium>
        {tokenVsMarket?.filter(
          entry => entry?.symbol !== baseAsset?.symbol && entry,
        )?.length > 0 ? (
          <Flex
            h={["20px", "20px", "21.5px", "23px"]}
            w="fit-content"
            px="6px"
            borderRadius="8px"
            ml="10px"
            bg={stateOfMarket?.bg}
            color={stateOfMarket?.color}
            fontSize={["12px", "12px", "13px", "14px"]}
            align="center"
          >
            {stateOfMarket?.state}
          </Flex>
        ) : (
          <Skeleton
            h={["20px", "20px", "21.5px", "23px"]}
            w="55px"
            borderRadius="8px"
            ml="10px"
            startColor={boxBg6}
            endColor={hover}
          />
        )}
      </Flex>
      <TableContainer
        maxH={["350px", "350px", "500px"]}
        overflowY="scroll"
        className="scroll"
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
                      textAlign={isFirst ? "start" : "end"}
                      display={[
                        entry === "Unit Price" ? "none" : "table-cell",
                        entry === "Unit Price" ? "none" : "table-cell",
                        "table-cell",
                        "table-cell",
                      ]}
                    >
                      <TextSmall fontWeight="500">{entry}</TextSmall>
                    </Ths>
                  );
                })}
            </Tr>
          </Thead>
          {(
            tokenVsMarket?.filter(
              entry => entry?.symbol !== baseAsset?.symbol && entry,
            ) || Array.from({length: 4})
          )?.map(pair => {
            const isTokens = pair?.symbol;
            return (
              <Tbody>
                <Tr>
                  <Td
                    borderBottom={borders}
                    pl={["10px", "10px", "20px"]}
                    pr="10px"
                    py="5px"
                    fontSize={["8px", "8px", "10px", "11px"]}
                  >
                    {isLoading ? (
                      <Skeleton
                        startColor={boxBg6}
                        endColor={hover}
                        h="20px"
                        borderRadius="4px"
                        w="120px"
                      />
                    ) : (
                      <TextSmall fontWeight="500" mb={["-5px", "-5px", "-2px"]}>
                        {`${isTokens ? pair?.symbol : pair?.name}`}
                      </TextSmall>
                    )}
                  </Td>

                  <Td
                    borderBottom={borders}
                    px="10px"
                    textAlign="end"
                    isNumeric
                  >
                    <Flex justify="flex-end" w="100%">
                      <TagPercentage
                        percentage={getPercentageChange("24h", pair)}
                        isUp={(getPercentageChange("24h", pair) || 0) > 0}
                        isLoading={isLoading}
                      />
                    </Flex>
                  </Td>
                  <Td borderBottom={borders} px="10px" isNumeric>
                    <Flex justify="flex-end" w="100%">
                      <TagPercentage
                        percentage={getPercentageChange("7d", pair)}
                        isUp={(getPercentageChange("7d", pair) || 0) > 0}
                        isLoading={isLoading}
                      />
                    </Flex>
                  </Td>
                  <Td borderBottom={borders} px="10px">
                    <Flex justify="flex-end" w="100%">
                      <TagPercentage
                        percentage={getPercentageChange("1m", pair)}
                        isUp={(getPercentageChange("1m", pair) || 0) > 0}
                        isLoading={isLoading}
                      />
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            );
          })}
        </Table>
      </TableContainer>
    </Flex>
  );
};
