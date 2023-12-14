"use client";
import React, { useEffect } from "react";
import { Asset } from "../../interfaces/assets";
import { getFormattedAmount, getTokenPercentage } from "../../utils/formaters";

export const HeaderBanner = ({ assets }: { assets: Asset[] }) => {
  const animationRef = React.useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const scroller = animationRef.current;
      scroller.setAttribute("data-animated", "true");
      const scrollerInner: any = scroller.querySelector(
        ".scrollerAnimated-inner"
      );
      const scrollerContent: any = Array.from(scrollerInner.children);

      scrollerContent.forEach((item) => {
        const duplicated: any = item?.cloneNode(true);
        duplicated.setAttribute("aria-hidden", "true");
        scrollerInner.appendChild(duplicated);
      });
    }
  }, []);

  return (
    <div className="h-[40px] w-full px-[15px] flex justify-between border-b border-light-border-primary dark:border-dark-border-primary">
      <div
        className="scrollerAnimated flex w-full"
        ref={animationRef}
        data-speed="slow"
      >
        <div className="scrollerAnimated-inner flex">
          {assets
            ?.filter((entry) => entry.price_change_24h < 1000)
            .map((asset) => {
              const isUp = getTokenPercentage(asset?.price_change_24h) > 0;
              return (
                <div
                  key={asset?.id}
                  className={`flex items-center justify-center h-full w-full mx-1`}
                >
                  {/* <span className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-full bg-[#fff] dark:bg-[#fff]">
                    <img
                      src={asset?.logo}
                      alt="blockchain"
                      className="rounded-full w-full h-full shadow-2xl"
                    />{" "}
                  </span> */}
                  <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] ml-[5px] font-['Poppins']">
                    {asset?.symbol}
                  </p>
                  <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] ml-[8px] font-['Poppins']">
                    ${getFormattedAmount(asset?.price)}
                  </p>
                  <p
                    className={`${
                      isUp
                        ? "text-green dark:text-green"
                        : "text-red dark:text-red"
                    } text-[13px] ml-[8px] font-['Poppins']`}
                  >
                    {isUp
                      ? `+${getTokenPercentage(asset?.price_change_24h)}`
                      : getTokenPercentage(asset?.price_change_24h)}
                    %
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <div className="bg-light-bg-primary dark:bg-red pl-5 h-full w-fit">
        firofrsroorsfr
      </div>
    </div>
  );
};
