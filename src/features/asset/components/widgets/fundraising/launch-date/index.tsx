import {Flex, Text, useColorMode} from "@chakra-ui/react";
import {useContext} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {TextLandingSmall, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {getDate} from "../../../../../../User/Portfolio/utils";
import {BaseAssetContext} from "../../../../context-manager";

export const LaunchDate = () => {
  const {borders, boxBg3, text60, text80} = useColors();
  const {unformattedHistoricalData} = useContext(BaseAssetContext);
  const launchDate = unformattedHistoricalData?.price?.ALL?.[0]?.[0];
  const oneWeekLater = launchDate + 1 * 24 * 60 * 60 * 1000;
  const {colorMode} = useColorMode();
  const isDark = colorMode === "dark";
  const bordersColor = isDark
    ? "3px solid rgba(255,255,255,0.2)"
    : "3px solid rgba(0,0,0,0.2)";
  const bgLine = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  const getDifferenceDate = () => {
    const date = new Date();
    const launch = new Date(launchDate);
    const diff = date.getTime() - launch.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getFirstWeekData = () => {
    const data = unformattedHistoricalData?.price?.ALL?.filter(
      item => item[0] <= oneWeekLater,
    );
    return data;
  };

  const daysAgo = getDifferenceDate();
  const date = getDate(launchDate);
  const dataOfFirstWeek = getFirstWeekData();
  const sortedAmounts = dataOfFirstWeek?.sort((a, b) => a[1] - b[1]);
  const ATH = getFormattedAmount(
    sortedAmounts?.[sortedAmounts.length - 1]?.[1] || 0,
  );
  const ATL = getFormattedAmount(sortedAmounts?.[0]?.[1] || 0);
  const listingPrice = getFormattedAmount(dataOfFirstWeek?.[0]?.[1] || 0);

  const getPercentage = price => {
    const percentage = (100 / (ATH - ATL)) * (price - ATL);
    return percentage.toFixed(2);
  };

  const listingPricePercentage = getPercentage(listingPrice);

  return (
    <Flex
      p="20px"
      borderRadius="16px"
      border={borders}
      bg={boxBg3}
      mb="10px"
      w="100%"
      mx="auto"
      direction="column"
      mt={["10px", "0px"]}
    >
      <Flex justify="space-between">
        <Text
          fontSize={["16px", "16px", "16px", "18px"]}
          fontWeight="500"
          color={text80}
          mb="10px"
        >
          Launch Stats
        </Text>{" "}
      </Flex>
      <Flex justify="center" direction="column" mb="15px">
        <TextSmall color={text80} fontWeight="600" mb="0px" fontSize="14px">
          {launchDate ? date : "--/--/--"}
        </TextSmall>{" "}
        <TextSmall color={text60} fontWeight="500" mb="0px" fontSize="14px">
          {daysAgo} days ago
        </TextSmall>{" "}
      </Flex>
      <TextLandingSmall
        fontWeight="500"
        fontSize={["14px", "14px", "14px", "16px"]}
        color={text80}
      >
        Volatility
      </TextLandingSmall>
      <Flex
        h="20px"
        mt="20px"
        position="relative"
        borderRadius="3px"
        borderRight={bordersColor}
        borderLeft={bordersColor}
        align="center"
      >
        <Flex
          bg="blue"
          w="3px"
          h="20px"
          position="absolute"
          left={`${listingPricePercentage}%`}
          borderRadius="4px"
        />
        <Flex
          bg="grey"
          w="3px"
          h="20px"
          position="absolute"
          left="0%"
          borderRadius="4px"
        />
        <Flex
          bg="grey"
          w="3px"
          h="20px"
          position="absolute"
          left="100%"
          borderRadius="4px"
        />
        <Flex bg={bgLine} w="100%" h="3px" />
      </Flex>
      <Flex justify="space-between" mt="10px">
        <Flex justify="center" direction="column">
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            ATL (24h after listing):
          </TextSmall>{" "}
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            {ATL ? `$${ATL}` : "--"}
          </TextSmall>
        </Flex>
        <Flex justify="center" direction="column">
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            ATH (24h after listing):
          </TextSmall>{" "}
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            {ATH ? `$${ATH}` : "--"}
          </TextSmall>
        </Flex>

        <Flex justify="center" direction="column">
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            Listing Price:
          </TextSmall>{" "}
          <TextSmall color={text80} textAlign="start" fontWeight="500" mb="0px">
            {`$${listingPrice}` || "--"}
          </TextSmall>
        </Flex>
      </Flex>
    </Flex>
  );
};
