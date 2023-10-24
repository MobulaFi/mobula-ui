"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useUrl = () => {
  const [watchlistUrl, setWatchlistUrl] = useState<string>("/watchlist");
  const { isConnected } = useAccount();
  const [portfolioUrl, setPortfolioUrl] = useState("/portfolio");

  useEffect(() => {
    if (isConnected === false) {
      setWatchlistUrl("/watchlist/discover");
      setPortfolioUrl("/portfolio/discover");
    } else {
      setWatchlistUrl("/watchlist");
      setPortfolioUrl("/portfolio");
    }
  }, [isConnected]);

  return { watchlistUrl, portfolioUrl };
};
