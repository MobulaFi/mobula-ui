/* eslint-disable no-nested-ternary */
import { Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { BtcDominance } from "./btc-dominance";
import { CryptoMarket } from "./crypto-market";
import { FearGreed } from "./fear-greed";

export const BoxMiddle = ({
  showPageMobile = 0,
  metrics,
}: {
  showPageMobile?: number;
  metrics: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
}) => {
  const { borders, boxBg3, text40, text80 } = useColors();
  const [showPage, setShowPage] = useState(0);
  const tablet =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 991 &&
    (typeof window !== "undefined" ? window.innerWidth : 0) >= 480;

  const render = [
    <FearGreed showPage={showPage} metrics={metrics} key="FearGreed" />,
    <CryptoMarket
      showPage={showPage}
      height={
        typeof showPageMobile === "number"
          ? "165px"
          : tablet
          ? "175px"
          : "190px"
      }
      key="CryptoMarket"
    />,
    <BtcDominance
      showPage={showPage}
      height={
        typeof showPageMobile === "number"
          ? "165px"
          : tablet
          ? "175px"
          : "190px"
      }
      key="BtcDominance"
    />,
    // <Test showPage={showPage} />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPage((prevPage) => (prevPage + 1) % 3);
    }, 12000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex
      h={["175px", "175px", "175px", "200px"]}
      borderRadius="12px"
      overflow="hidden"
      border={borders}
      bg={boxBg3}
      position="relative"
      mx={["0px", "0px", "10px"]}
      minW={["100%", "100%", "407px"]}
      w={["100%", "31.5%"]}
      transform={`translateX(-${showPageMobile * 100}%)`}
      transition="all 500ms ease-in-out"
      zIndex={showPageMobile === 1 ? 3 : 1}
    >
      <Flex
        align="center"
        position="absolute"
        top="0px"
        right="0px"
        h="35px"
        px="15px"
        bg={boxBg3}
        zIndex="1"
      >
        {render.map((_, idx) => (
          <Button
            borderRadius="full"
            key={_.key}
            boxSize={showPage === idx ? "9px" : "8px"}
            w={showPage === idx ? "9px" : "8px"}
            maxW={showPage === idx ? "9px" : "8px"}
            px="0px"
            bg={showPage === idx ? text80 : text40}
            ml="5px"
            onClick={() => setShowPage(idx)}
          />
        ))}
      </Flex>
      {render}
    </Flex>
  );
};
