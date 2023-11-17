import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {Flex, Text} from "@chakra-ui/react";
import {useContext, useMemo} from "react";
import {
  formatAmount,
  getClosest,
  getFormattedAmount,
} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {getDate} from "../../../../../../User/Portfolio/utils";
import {timestamp} from "../../../../constant";
import {BaseAssetContext} from "../../../../context-manager";
import {useAthPrice} from "../../../../hooks/use-athPrice";
import {useMarketMetrics} from "../../../../hooks/use-marketMetrics";
import {FlexBorderBox} from "../../../../style";

export const AllTime = () => {
  const {text80, hover, text60, borders, boxBg3} = useColors();
  const {priceLow, priceHigh} = useAthPrice(true);
  const {baseAsset, historyData} = useContext(BaseAssetContext);
  const {marketMetrics} = useMarketMetrics(baseAsset);

  const priceChange = useMemo(() => {
    if (historyData?.price_history) {
      return (
        (marketMetrics.price /
          getClosest(
            historyData.price_history.concat(
              baseAsset.price_history?.price || [],
            ),
            Math.max(Date.now() - timestamp.ALL, 0),
          ) -
          1) *
        100
      );
    }
    return baseAsset?.price_change_24h;
  }, [baseAsset, historyData]);
  const isUp = priceChange > 0;

  const getPercentageForAllTime = value => {
    const percentage = (((baseAsset?.price || 0) - value) / value) * 100;
    return percentage.toFixed(2);
  };

  const percentageATHup =
    Number(getPercentageForAllTime(baseAsset?.ath?.[1])) > 0 || false;
  const percentageATLup =
    Number(getPercentageForAllTime(baseAsset?.atl?.[1])) > 0 || false;

  return (
    <Flex
      {...FlexBorderBox}
      bg={boxBg3}
      border={["none", "none", "none", borders]}
      p={["15px", "15px", "15px", "20px"]}
      borderRadius={["0px", "0px", "0px", "16px"]}
    >
      <Text
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb={["7.5px", "7.5px", "7.5px", "20px"]}
      >
        All Time
      </Text>

      <Flex borderRadius="4px" h="7px" bg={hover} w="100%">
        <Flex
          borderRadius="4px"
          h="100%"
          bg={isUp ? "green" : "red"}
          w={
            priceLow && priceHigh
              ? `${
                  ((baseAsset.price - priceLow) / (priceHigh - priceLow)) * 100
                }%`
              : "0%"
          }
        />
      </Flex>
      <Flex align="center" justify="space-between" mt="7.5px">
        <Text fontSize="13px" color={text80} fontWeight="500">
          ${formatAmount(priceLow)}
        </Text>
        <Text fontSize="13px" color={text80} fontWeight="500">
          ${getFormattedAmount(priceHigh)}
        </Text>
      </Flex>
      <Flex align="center" justify="space-between" mt="20px">
        <Flex direction="column">
          <TextSmall color={text80} fontWeight="600" mb="3px">
            Low
          </TextSmall>
          <Text fontSize="12px" color={text60} fontWeight="500">
            {getDate(baseAsset?.atl?.[0])}
          </Text>
        </Flex>
        <Flex direction="column" align="end">
          <Text fontSize="13px" mb="3px" fontWeight="500" color={text80}>
            ${formatAmount(baseAsset?.atl?.[1])}
          </Text>
          <Text
            fontSize={["12px", "12px", "13px"]}
            color={percentageATLup ? "green" : "red"}
            fontWeight="500"
          >
            {percentageATLup ? (
              <TriangleUpIcon fontSize="10px" mr="5px" />
            ) : (
              <TriangleDownIcon fontSize="10px" mr="5px" />
            )}
            {getPercentageForAllTime(baseAsset?.atl?.[1])}%
          </Text>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt="20px">
        <Flex direction="column">
          <TextSmall color={text80} fontWeight="600" mb="3px">
            High
          </TextSmall>
          <Text fontSize="12px" color={text60} fontWeight="500">
            {getDate(baseAsset?.ath?.[0])}
          </Text>
        </Flex>
        <Flex direction="column" align="end">
          <TextSmall fontSize="13px" fontWeight="500" mb="3px" color={text80}>
            ${getFormattedAmount(baseAsset?.ath?.[1])}
          </TextSmall>
          <Text
            fontSize={["12px", "12px", "13px"]}
            fontWeight="500"
            color={percentageATHup ? "green" : "red"}
          >
            {percentageATHup ? (
              <TriangleUpIcon fontSize="10px" mr="5px" />
            ) : (
              <TriangleDownIcon fontSize="10px" mr="5px" />
            )}
            {getPercentageForAllTime(baseAsset?.ath?.[1])}%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
