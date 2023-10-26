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
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary flex-col py-2.5 px-3.5 relative overflow-hidden min-w-[407px] md:min-w-full w-[31.5%] sm:w-full transition duration-500 translate-x-[-${
        showPageMobile * 100
      }%] z-[${showPageMobile === 1 ? 3 : 1}] mx-2.5 md:mx-0`}
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
    </div>
  );
};
