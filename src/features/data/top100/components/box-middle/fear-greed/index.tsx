import { Flex } from "@chakra-ui/react";
import React from "react";
import { TextLandingSmall } from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import CryptoFearAndGreedChart from "./crypto-fear-greed";

export const FearGreed = ({
  showPage,
  metrics,
}: {
  showPage: number;
  metrics: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
}) => {
  const { text80 } = useColors();
  return (
    <Flex
      minW="100%"
      direction="column"
      w="200px"
      transform={`translateX(-${showPage * 100}%)`}
      transition="all 250ms ease-in-out"
    >
      <TextLandingSmall
        zIndex="1"
        position="absolute"
        top="10px"
        left="15px"
        color={text80}
      >
        Today Fear & Greed
      </TextLandingSmall>

      <Flex
        align="center"
        justify="center"
        w="45%"
        maxW="185px"
        h="fit-content"
        mt={["35px", "35px", "35px", "45px"]}
        mx="auto"
      >
        <CryptoFearAndGreedChart
          fearLevel={metrics?.fear_and_greed_value || 50}
          fearClassification={
            metrics?.fear_and_greed_value_classification || "Neutral"
          }
        />
      </Flex>
    </Flex>
  );
};
