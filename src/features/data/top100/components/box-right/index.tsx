import { Button, Flex, useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { getDiscoverInfos } from "../../constants";
import { AINews } from "./AI-news";
import { Discover } from "./discover";

interface BoxRightProps {
  showPageMobile?: number;
}

export const BoxRight = ({ showPageMobile = 0 }: BoxRightProps) => {
  const { boxBg3, borders, text40, text80 } = useColors();
  const [showPage, setShowPage] = useState(0);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const render = [
    <AINews showPage={showPage} key="AiNews" />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[0]}
      key="Discover1"
    />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[1]}
      key="Discover2"
    />,
    <Discover
      showPage={showPage}
      info={getDiscoverInfos(isDark)[2]}
      key="Discover3"
    />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPage((prevPage) => (prevPage + 1) % 4);
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary flex-col py-2.5 px-3.5 relative overflow-hidden min-w-[407px] md:min-w-full w-[31.5%] sm:w-full transition duration-500 translate-x-[-${
        showPageMobile * 100
      }%] z-[${showPageMobile === 2 ? 3 : 1}] ml-2.5 md:mx-0`}
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
            key={Math.random()}
            boxSize={showPage === idx ? "9px" : "8px"}
            w={showPage === idx ? "9px" : "8px"}
            bg={showPage === idx ? text80 : text40}
            ml="5px"
            transition="all 500ms ease-in-out"
            onClick={() => setShowPage(idx)}
          />
        ))}
      </Flex>
      {render}
    </div>
  );
};
