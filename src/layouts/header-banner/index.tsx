"use client";
import { GET } from "@utils/fetch";
import React, { useEffect, useRef, useState } from "react";
import { NextChakraLink } from "../../components/link";
import { Asset } from "../../interfaces/assets";
import {
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../utils/formaters";

export const HeaderBanner = ({ assets }: { assets: Asset[] }) => {
  const animationRef = useRef(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [assetsUpdated, setAssetsUpdated] = useState<Asset[]>(assets || []);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const scroller = animationRef?.current;
      if (scroller) {
        const scrollerInner: any = scroller?.querySelector(
          ".scrollerAnimated-inner"
        );
        const scrollerContent: any = Array?.from(scrollerInner.children);

        scrollerContent?.forEach((item) => {
          const duplicated: any = item?.cloneNode(true);
          duplicated?.setAttribute("aria-hidden", "true");
          scrollerInner?.appendChild(duplicated);
        });
      }
    }
  }, []);

  const fetchAssets = () => {
    GET("/api/1/metadata/trendings", {}, false, {
      "x-api-key": process.env.NEXT_PUBLIC_PRICE_KEY as string,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) setAssetsUpdated(res);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="h-[40px] px-[15px] flex justify-between border-b border-light-border-primary dark:border-dark-border-primary w-full">
      <div
        className="scrollerAnimated flex  overflow-hidden"
        ref={animationRef}
        data-speed="hyper-slow"
        data-animated="true"
        data-paused={!isAnimationPlaying}
      >
        <div
          className="scrollerAnimated-inner flex"
          onMouseEnter={() => setIsAnimationPlaying(false)}
          onMouseLeave={() => setIsAnimationPlaying(true)}
        >
          {assetsUpdated?.map?.((asset, index) => {
            const isUp: boolean =
              Number(getTokenPercentage(asset?.price_change_24h)) > 0;
            return (
              <NextChakraLink
                key={asset?.id + "-" + index}
                href={`/asset/${getUrlFromName(asset?.name || "")}`}
              >
                <div
                  className={`flex items-center justify-center h-full w-full mx-1`}
                >
                  <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] ml-[5px] font-['Poppins']">
                    {asset?.symbol}
                  </p>
                  <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] ml-1.5 font-['Poppins']">
                    $
                    {getFormattedAmount(asset?.price, 0, {
                      canUseHTML: true,
                    })}
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
    </div>
  );
};
