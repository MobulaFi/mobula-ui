"use client";
import { IPortfolio } from "interfaces/pages/portfolio";
import React, { createContext, useContext, useState } from "react";
import { steps } from "../constants";
import { ITop100, View } from "../models";

const Top100Context = createContext<ITop100>({} as ITop100);

export const useTop100 = () => useContext(Top100Context);

interface Top100ProviderProps {
  children: JSX.Element | JSX.Element[];
  activeViewCookie?: View | null;
  portfolioCookie?: IPortfolio | null;
  btcPrice: { name: string; price: number } | null;
  ethPrice: { name: string; price: number } | null;
  page: number | null;
  isMobile: boolean;
  isTablet: boolean;
}

export const Top100Provider = ({
  children,
  activeViewCookie = null,
  portfolioCookie = null,
  btcPrice,
  ethPrice,
  page,
  isMobile,
  isTablet,
}: Top100ProviderProps) => {
  const activeViewBuffer = activeViewCookie || {};
  const [activeDisplay, setActiveDisplay] = useState("display");
  const [news, setNews] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState<IPortfolio | null>(
    portfolioCookie || null
  );
  const [mainCurrenciesPrices, setMainCurrenciesPrices] = useState({
    eth: ethPrice?.price,
    btc: btcPrice?.price,
  } as {
    eth: number;
    btc: number;
  });
  const [activeView, setActiveView] = useState<View>(activeViewBuffer as View);
  const [isLoading, setIsLoading] = useState(page && page > 1);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);
  const [totalMarketCap, setTotalMarketCap] = useState<[number, number][]>([]);
  const [marketCapChange, setMarketCapChange] = useState(0);
  const [btcDominance, setBtcDominance] = useState<[number, number][]>([]);
  const [portfolio, setPortfolio] = useState([]);
  const [activeStep, setActiveStep] = useState(steps[0]);
  const [fearData, setFearData] = useState(
    {} as {
      fear_and_greed_value: number;
      fear_and_greed_value_classification: string;
    }
  );

  const contextValue = React.useMemo(
    () => ({
      setActiveView,
      activeView,
      isLoading,
      setIsLoading,
      totalMarketCap,
      setTotalMarketCap,
      marketCapChange,
      setMarketCapChange,
      btcDominance,
      setBtcDominance,
      setIsPortfolioLoading,
      isPortfolioLoading,
      setPortfolio,
      portfolio,
      activePortfolio,
      setActivePortfolio,
      setFearData,
      fearData,
      setMainCurrenciesPrices,
      mainCurrenciesPrices,
      activeDisplay,
      setActiveDisplay,
      setActiveStep,
      activeStep,
      news,
      setNews,
      setShowCategories,
      showCategories,
      isMobile,
      isTablet,
    }),
    [
      setActiveView,
      activeView,
      isLoading,
      setIsLoading,
      totalMarketCap,
      setTotalMarketCap,
      marketCapChange,
      setMarketCapChange,
      btcDominance,
      setBtcDominance,
      setIsPortfolioLoading,
      isPortfolioLoading,
      setPortfolio,
      portfolio,
      activePortfolio,
      setActivePortfolio,
      setFearData,
      fearData,
      setMainCurrenciesPrices,
      mainCurrenciesPrices,
      activeDisplay,
      setActiveDisplay,
      setActiveStep,
      activeStep,
      news,
      setNews,
      setShowCategories,
      showCategories,
      isMobile,
      isTablet,
    ]
  );

  return (
    <Top100Context.Provider value={contextValue}>
      {children}
    </Top100Context.Provider>
  );
};
