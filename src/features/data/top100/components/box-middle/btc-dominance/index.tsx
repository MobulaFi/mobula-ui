import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { getTokenPercentage } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

export const BtcDominance = ({ showPage, height }) => {
  const { text80 } = useColors();
  const { btcDominance } = useTop100();
  return (
    <Flex
      minW="100%"
      direction="column"
      w="200px"
      transform={`translateX(-${showPage * 100}%)`}
      transition="all 250ms ease-in-out"
    >
      <Flex
        direction="column"
        position="absolute"
        zIndex="1"
        w="94%"
        top="10px"
      >
        <Flex justify="space-between" w="100%">
          <TextLandingSmall color={text80} ml="15px">
            Bitcoin Dominance
          </TextLandingSmall>
        </Flex>
        <Flex>
          <TextLandingMedium mt="-2px" ml="15px">
            {getTokenPercentage(
              btcDominance?.[(btcDominance?.length || 1) - 1]?.[1] || 0
            )}
            %
          </TextLandingMedium>
          <Flex mt="2px">
            {/* <TagPercentage
              isUp={btcDominance > 0}
              percentage={marketCapChange}
            />{" "} */}
          </Flex>
        </Flex>
      </Flex>
      <Flex w="100%" mt="12px" h="100%" justify="center" mb="10px" px="15px">
        <EChart
          data={btcDominance || []}
          timeframe="24H"
          width="98%"
          //   leftMargin={["20%", "12%"]}
          leftMargin={["0%", "0%"]}
          height={height}
          bg="transparent"
          // bg={isDarkMode ? "#151929" : "#F7F7F7"}
          type="BTC Dominance %"
          noDataZoom
          noAxis
        />
      </Flex>
    </Flex>
  );
};
