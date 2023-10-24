import { Flex } from "@chakra-ui/react";
import { NextImageFallback } from "components/image";
import { Segment } from "../segment";

export const ChartSegment = ({ token, display }) => (
  <Segment>
    <Flex justify="center" w="100%" h="45px" zIndex={1}>
      <NextImageFallback
        width={135}
        height={45}
        alt={`${token.name} sparkline`}
        style={{ zIndex: 0 }}
        src={
          `https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${token.id}/24h.png` ||
          "/404/sparkline.png"
        }
        fallbackSrc="/404/sparkline.png"
        unoptimized
      />
    </Flex>
  </Segment>
);
