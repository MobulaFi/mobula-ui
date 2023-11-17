import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Collapse, Flex, Text} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../../../utils/helpers/formaters";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {TagPercentage} from "../../../../../../User/Portfolio/components/ui/tag-percentage";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";
import {getDateFromTimeStamp, timeframes} from "../../../../utils";

export const PriceInTime = ({...props}) => {
  const {text80, text100, hover, boxBg6, borders, boxBg3, text60} = useColors();
  const {unformattedHistoricalData, baseAsset} = useContext(BaseAssetContext);
  const [showMore, setShowMore] = useState(
    !Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length,
  );

  const sortOrder = [
    "24h",
    "3D",
    "7D",
    "1M",
    "3M",
    "6M",
    "1Y",
    "2Y",
    "3Y",
    "4Y",
    "5Y",
    "6Y",
    "7Y",
    "8Y",
    "9Y",
    "10Y",
  ];

  function getHistoricalPrices(history) {
    const results = {};
    Object.keys(timeframes).forEach(key => {
      const targetTimestamp = Date.now() - timeframes[key];
      const filteredHistory = history.filter(
        item => item[0] >= targetTimestamp,
      );
      if (filteredHistory.length > 0) {
        const [, value] = filteredHistory[0];
        results[key] = value;
      }
    });

    let lastUniqueKey;
    for (let i = sortOrder.length - 1; i >= 1; i -= 1) {
      if (results[sortOrder[i]] !== results[sortOrder[i - 1]]) {
        lastUniqueKey = sortOrder[i - 1];
        break;
      }
    }

    const cutOffIndex = sortOrder.indexOf(lastUniqueKey) + 1;
    const newResults = {};

    Object.entries(results).forEach(([key, value], i, arr) => {
      if (sortOrder.indexOf(key) > cutOffIndex) return;

      const [, nextValue] = arr[i + 1] || [];

      if (!nextValue) {
        newResults[key] = [value, 0];
        return;
      }

      const percentageChange =
        ((Number(value) - Number(nextValue)) / Number(nextValue)) * 100;
      newResults[key] = [value, percentageChange];
    });

    return newResults;
  }

  getHistoricalPrices(
    Object.entries(getHistoricalPrices(unformattedHistoricalData?.price?.ALL)),
  );

  return (
    <Flex
      {...FlexBorderBox}
      bg={boxBg3}
      border={["none", "none", "none", borders]}
      {...props}
      p="0px !important"
      borderRadius={["0px", "0px", "16px"]}
    >
      <Text
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mt={["20px", "20px", "20px", "0px"]}
        mb="10px"
        p={["0px 20px", "0px 20px", "0px 20px", "20px 20px 0px 20px"]}
      >
        Price-in-time
      </Text>
      <Collapse
        startingHeight={
          Object.entries(
            getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
          ).length > 5
            ? 220
            : Object.entries(
                getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
              ).length * 44
        }
        in={showMore}
      >
        {Object.entries(
          getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
        )
          ?.filter(
            (entry, i) =>
              entry[1] !==
              Object.entries(
                getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
              )[i - 1]?.[1],
          )
          .map((entry, i) => (
            <Flex
              px="20px"
              justify="space-between"
              borderTop={i === 0 ? "none" : borders}
              py="10px"
              pb={
                Object.entries(
                  getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
                ).length -
                  1 ===
                i
                  ? "10px"
                  : "10px"
              }
              color={text80}
            >
              <Flex align="center" fontSize="14px" mb="5px" color={text60}>
                {getDateFromTimeStamp(entry[0])}
              </Flex>
              <Flex align="center">
                <Text fontSize="13px" color={text80} fontWeight="500">
                  ${getFormattedAmount(entry[1][0])}
                </Text>
                <TagPercentage
                  fs={["12px", "12px", "13px"]}
                  h={["20px", "20px", "21.5px", "21.5px"]}
                  percentage={Number(getTokenPercentage(entry[1][1]))}
                  isUp={Number(getTokenPercentage(entry[1][1])) > 0}
                />
              </Flex>
            </Flex>
          ))}
      </Collapse>
      {Object.entries(
        getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
      )?.filter(
        (entry, i) =>
          entry[1] !==
          Object.entries(
            getHistoricalPrices(unformattedHistoricalData?.price?.ALL),
          )[i - 1]?.[1],
      ).length > 5 ? (
        <Button
          mt="10px"
          fontWeight="400"
          color={text80}
          mx="auto"
          fontSize="14px"
          h="30px"
          w="100%"
          bg={boxBg6}
          borderTop={borders}
          onClick={() => setShowMore(!showMore)}
          _hover={{color: text100, bg: hover}}
          transition="all 250ms ease-in-out"
          borderRadius="0px 0px 12px 12px"
        >
          {showMore ? "Show less" : "Show more"}
          <ChevronDownIcon
            ml="5px"
            transform={showMore ? "rotate(180deg)" : "rotate(0deg)"}
            fontSize="16px"
            transition="all 250ms ease-in-out"
          />
        </Button>
      ) : null}
    </Flex>
  );
};
