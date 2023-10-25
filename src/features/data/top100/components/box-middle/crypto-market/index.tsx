import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../../components/fonts";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

export const CryptoMarket = ({ showPage, height }) => {
  const { text80 } = useColors();
  const { totalMarketCap, marketCapChange } = useTop100();

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
            Crypto Market Cap
          </TextLandingSmall>
        </Flex>
        <Flex>
          <TextLandingMedium mt="-2px" ml="15px">
            $
            {getFormattedAmount(
              totalMarketCap?.[totalMarketCap.length - 1 || 0]?.[1]
            )}
          </TextLandingMedium>
          <Flex mt="2px">
            <TagPercentage
              isUp={(marketCapChange || 0) > 0}
              percentage={marketCapChange || 0}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex w="100%" mt="12px" h="100%" justify="center" mb="10px" px="15px">
        <EChart
          data={(totalMarketCap as []) || []}
          timeframe="24H"
          width="100%"
          //   leftMargin={["20%", "12%"]}
          leftMargin={["0%", "0%"]}
          height={height}
          bg="transparent"
          // bg={isDarkMode ? "#151929" : "#F7F7F7"}
          type="Total MC"
          noDataZoom
          noAxis
        />
      </Flex>
    </Flex>
  );
};
