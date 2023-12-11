import React from "react";
import {
  ExtraSmallFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import CryptoFearAndGreedChart from "../fear-greed/crypto-fear-greed";

export const Test = ({ showPage }) => {
  //   const colors = [
  //     "green",
  //     "orange",
  //     "pink",
  //     "purple",
  //     "red",
  //     "teal",
  //     "yellow",
  //     "blue",
  //     "cyan",
  //     "gray",
  //   ];

  const getColors = (i: number, note: number) => {
    if (i > note) return "bg-light-bg-hover dark:bg-dark-bg-hover";
    if (i < 2) return "bg-red dark:bg-red";
    if (i < 5) return "bg-orange dark:bg-orange";
    if (i < 7) return "bg-yellow dark:bg-yellow";
    return "bg-green dark:bg-green";
  };

  const notes = [2.3, 7, 3];

  return (
    <div
      className="flex flex-col w-[200px] p-2.5 transition-all duration-200 ease-in-out min-w-full"
      style={{
        transform: `translateX(-${showPage * 100}%)`,
      }}
    >
      <MediumFont extraCss="mb-[5px]">Top Traded Coins</MediumFont>
      <div className="flex w-full mt-3 h-full flex-col mb-2.5 px-2.5">
        {notes.map((note, i) => (
          <div
            key={note + i}
            className="flex items-center mb-[12.5px] justify-between w-full"
          >
            <div className="flex items-center">
              <NextImageFallback
                width={24}
                height={24}
                className="rounded-full"
                src="/logo/bitcoin.png"
                fallbackSrc="/empty/unknown.png"
              />
              <div className="flex flex-col">
                <ExtraSmallFont extraCss="ml-2.5 font-medium">
                  BTC
                </ExtraSmallFont>
                <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[7.5px] -mt-0.5 font-medium">
                  1200 Trades
                </ExtraSmallFont>
              </div>
            </div>
            <div className="w-[53%] flex ml-auto">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex relative w-[10%]">
                  <div className="w-2 h-[50px] flex bg-light-bg-secondary dark:bg-dark-bg-secondary absolute left-[-16%] top-[-10px] z-30" />
                  <div
                    className={`flex w-full h-5 ${getColors(index, note)}`}
                  />
                  {index === 9 ? (
                    <div className="w-2 h-[50px] flex bg-light-bg-secondary dark:bg-dark-bg-secondary absolute left-[-38%] top-[-10px] z-[2]" />
                  ) : null}
                </div>
              ))}
            </div>
            <SmallFont extraCss="w-[30px] text-end font-medium">
              {note}
            </SmallFont>
          </div>
        ))}

        {/* <EChart
        data={(totalMarketCap as []) || []}
        timeframe="24H"
        width="100%"
        //   leftMargin={["20%", "12%"]}
        leftMargin={["0%", "0%"]}
        height={height}
        bg={isDarkMode ? "#151929" : "#F7F7F7"}
        type="Total Market Cap"
        noDataZoom
        noAxis
      /> */}
      </div>
    </div>
  );
};

export default CryptoFearAndGreedChart;
