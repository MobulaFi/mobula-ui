import React, { Key, useEffect, useState } from "react";
import { useTop100 } from "../../context-manager";
import { CryptoMarket } from "./crypto-market";
import { FearGreed } from "./fear-greed";

interface BoxMiddleProps {
  showPageMobile?: number;
  metrics:
    | {
        fear_and_greed_value: number;
        fear_and_greed_value_classification: string;
      }
    | null
    | undefined;
}

const BoxMiddle = ({ showPageMobile = 0, metrics }: BoxMiddleProps) => {
  const [showPage, setShowPage] = useState(0);
  const {
    setTotalMarketCap,
    setMarketCapChange,
    setBtcDominance,
    totalMarketCap,
    btcDominance,
    marketCapChange,
  } = useTop100();

  const fetchMetrics = async () => {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/total`
    );
    try {
      const data = await req.json();
      setTotalMarketCap(data.market_cap_history);
      setBtcDominance(data.btc_dominance_history);
      setMarketCapChange(data.market_cap_change_24h);
    } catch (e) {}
  };

  useEffect(() => {
    if (!totalMarketCap?.length || !btcDominance?.length || !marketCapChange)
      fetchMetrics();
  }, [totalMarketCap, btcDominance, marketCapChange, showPage]);

  const render = [
    <FearGreed showPage={showPage} metrics={metrics} key="FearGreed" />,
    <CryptoMarket showPage={showPage} key="CryptoMarket" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPage((prevPage) => (prevPage + 1) % 2);
    }, 12000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative overflow-hidden 
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 ${
        showPageMobile === 1 ? "z-[3]" : "z-[1]"
      }] mx-2.5 md:mx-0`}
      style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
    >
      <div className="flex items-center absolute top-0 right-0 h-[35px] px-[15px] bg-light-bg-secondary dark:bg-dark-bg-secondary z-[1]">
        {render.map((_, idx) => (
          <button
            className={`rounded-full ${
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
            key={idx as Key}
            onClick={() => setShowPage(idx)}
          />
        ))}
      </div>
      {render}
    </div>
  );
};

export default BoxMiddle;
