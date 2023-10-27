import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/button";
import { getDiscoverInfos } from "../../constants";
import { AINews } from "./AI-news";
import { Discover } from "./discover";

interface BoxRightProps {
  showPageMobile?: number;
}

export const BoxRight = ({ showPageMobile = 0 }: BoxRightProps) => {
  const [showPage, setShowPage] = useState(0);
  // TODO: isDark is always true
  const isDark = true;

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
      <div className="flex items-center absolute top-0 right-0 h-[35px] px-[15px] bg-light-bg-secondary dark:bg-dark-bg-secondary z-[1]">
        {render.map((_, idx) => (
          <Button
            extraCss={`rounded-full ${
              showPage === idx ? "w-[9px]" : "w-[8px]"
            } ${showPage === idx ? "h-[9px]" : "h-[8px]"} ${
              showPage === idx ? "max-w-[9px]" : "max-w-[8px]"
            } ${
              showPage === idx ? "max-h-[9px]" : "max-h-[8px]"
            } px-0 ml-[5px] ${
              showPage === idx
                ? "bg-light-font-80 dark:bg-dark-font-80"
                : "bg-light-font-40 dark:bg-dark-font-40"
            } `}
            key={_.key}
            onClick={() => setShowPage(idx)}
          />
        ))}
      </div>
      {render}
    </div>
  );
};
