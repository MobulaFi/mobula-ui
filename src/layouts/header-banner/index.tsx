"use client";
import React, { useEffect } from "react";
import { Button } from "../../components/button";
import { NextChakraLink } from "../../components/link";
import { Asset } from "../../interfaces/assets";
import { pushData } from "../../lib/mixpanel";
import {
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../utils/formaters";
import { ToggleColorMode } from "../toggle-mode";

export const HeaderBanner = ({ assets }: { assets: Asset[] }) => {
  const animationRef = React.useRef(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = React.useState(true);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const scroller = animationRef.current;
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
        className="scrollerAnimated flex w-full overflow-hidden"
        ref={animationRef}
        data-speed="slow"
        data-animated="true"
        data-paused={!isAnimationPlaying}
      >
        <div
          className="scrollerAnimated-inner flex"
          onMouseEnter={() => setIsAnimationPlaying(false)}
          onMouseLeave={() => setIsAnimationPlaying(true)}
        >
          {assets
            ?.filter((entry) => entry.price_change_24h < 1000)
            .map((asset) => {
              const isUp =
                (getTokenPercentage(asset?.price_change_24h) as never) > 0;
              return (
                <NextChakraLink
                  key={asset?.id}
                  href={`/asset/${getUrlFromName(asset?.name || "")}`}
                >
                  <div
                    className={`flex items-center justify-center h-full w-full mx-1`}
                  >
                    <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] ml-[5px] font-['Poppins']">
                      {asset?.symbol}
                    </p>
                    <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] ml-1.5 font-['Poppins']">
                      ${getFormattedAmount(asset?.price)}
                    </p>
                    <p
                      className={`${
                        isUp
                          ? "text-green dark:text-green"
                          : "text-red dark:text-red"
                      } text-[13px] ml-1.5 font-['Poppins']`}
                    >
                      {isUp
                        ? `+${getTokenPercentage(asset?.price_change_24h)}`
                        : getTokenPercentage(asset?.price_change_24h)}
                      %
                    </p>{" "}
                  </div>{" "}
                </NextChakraLink>
              );
            })}
        </div>
      </div>
      <div className="pl-5 h-full w-fit flex items-center">
        <Button extraCss="h-[30px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue">
          <NextChakraLink
            extraCss="text-[13px]"
            href="https://docs.mobula.fi/?utm_source=header"
            onClick={() => {
              pushData("Header Free API Key Clicked");
            }}
          >
            Free API Key
          </NextChakraLink>
        </Button>
        <Button extraCss="h-[30px] mx-2.5">
          {" "}
          <NextChakraLink
            extraCss="text-[13px]"
            href="/list?utm_source=header"
            onClick={() => {
              pushData("Header Get listed Clicked");
            }}
          >
            Get listed
          </NextChakraLink>
        </Button>
        <ToggleColorMode extraCss="mr-2 md:mr-0" />
      </div>
    </div>
  );
};
