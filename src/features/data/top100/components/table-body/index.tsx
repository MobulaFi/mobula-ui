"use client";
import { createSupabaseDOClient } from "lib/supabase";
import { usePathname } from "next/navigation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "../../../../../components/button";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../contexts/settings";
import { UserContext } from "../../../../../contexts/user";
import { useIsInViewport } from "../../../../../hooks/viewport";
import { TableAsset } from "../../../../../interfaces/assets";
import { EntryContext } from "../../../../../layouts/new-tables/context-manager";
import { useWatchlist } from "../../../../../layouts/new-tables/hooks/watchlist";
import { Segment } from "../../../../../layouts/new-tables/segments";
import { ChangeSegment } from "../../../../../layouts/new-tables/segments/change";
import { ChartSegment } from "../../../../../layouts/new-tables/segments/chart";
import { MarketCapSegment } from "../../../../../layouts/new-tables/segments/market_cap";
import { PriceSegment } from "../../../../../layouts/new-tables/segments/price";
import { VolumeSegment } from "../../../../../layouts/new-tables/segments/volume";
import { TokenInfo } from "../../../../../layouts/new-tables/ui/token";
import { WatchlistAdd } from "../../../../../layouts/new-tables/ui/watchlist";
import { pushData } from "../../../../../lib/mixpanel";
import { getUrlFromName } from "../../../../../utils/formaters";
import { WatchlistContext } from "../../../../user/watchlist/context-manager";
import { IWatchlist } from "../../../../user/watchlist/models";
import { useTop100 } from "../../context-manager";

interface EntryProps {
  token: TableAsset;
  index: number;
  isMobile: boolean;
  showRank?: boolean;
}

export const Top100TBody = ({
  token: tokenBuffer,
  index,
  isMobile,
  showRank = false,
}: EntryProps) => {
  const [token, setToken] = useState<TableAsset>(tokenBuffer);
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();
  const { user } = useContext(UserContext);
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const isVisible = useIsInViewport(tableRef);
  const { setTokenToAddInWatchlist, activeWatchlist, setActiveWatchlist } =
    useContext(WatchlistContext);
  const [metricsChanges, setMetricsChanges] = useState<{
    price: boolean | null;
    volume: boolean | null;
    market_cap: boolean | null;
  }>({
    price: null,
    volume: null,
    market_cap: null,
  });
  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
  } = useContext(PopupUpdateContext);
  const { inWatchlist, handleAddWatchlist } = useWatchlist(token.id);
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { activeView } = useTop100();
  const [isLoading, setIsLoading] = useState(true);
  const [addedToWatchlist, setAddedToWatchlist] = useState(inWatchlist);
  const watchlist = user?.main_watchlist as IWatchlist;

  const updateMetricsChange = (key) => {
    setMetricsChanges((prev) => {
      let updatedValue = prev[key];
      if (token[key]) updatedValue = true;
      else if (token[key] !== undefined) updatedValue = false;
      return { ...prev, [key]: updatedValue };
    });

    setTimeout(() => {
      setMetricsChanges((prev) => ({ ...prev, [key]: null }));
    }, 800);
  };

  useEffect(() => updateMetricsChange("price"), [token?.price]);
  useEffect(() => updateMetricsChange("volume"), [token?.global_volume]);
  useEffect(() => updateMetricsChange("market_cap"), [token?.market_cap]);
  useEffect(() => updateMetricsChange("rank"), [token?.rank]);

  const fetchTokenData = useCallback(async () => {
    const supabase = createSupabaseDOClient();
    const { data, error } = await supabase
      .from("assets")
      .select("price,market_cap,global_volume,rank,created_at,price_change_24h")
      .match({ id: token.id })
      .single();
    if (error) {
      console.error("Error fetching token data:", error);
      return;
    }
    if (data) {
      const newData = {
        price: data.price,
        priceChange:
          data.price !== token.price ? data.price > token.price : undefined,
        market_cap: data.market_cap,
        marketCapChange:
          data.market_cap !== token.market_cap
            ? data.market_cap > token.market_cap
            : undefined,
        volume: data.global_volume,
        rank: data.rank,
        volumeChange:
          data.global_volume !== token.global_volume
            ? data.global_volume > token.global_volume
            : undefined,
        price_change_24h: data.price_change_24h,
      };
      setToken((prevToken) => {
        if (
          prevToken.price !== newData.price ||
          prevToken.market_cap !== newData.market_cap ||
          prevToken.volume !== newData.volume ||
          prevToken.rank !== newData.rank
        ) {
          return { ...prevToken, ...newData };
        }
        return prevToken;
      });
    }
  }, [token]);

  useEffect(() => {
    if (isVisible) {
      fetchTokenData();
      const interval = setInterval(fetchTokenData, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, tokenBuffer, fetchTokenData]);

  const monitoredMetrics = useMemo(
    () => ["price", "market_cap", "global_volume", "rank"],
    []
  );

  useEffect(() => {
    const updateMetricsChange = (key) => {
      setMetricsChanges((prev) => {
        let updatedValue = prev[key];
        if (token[key]) updatedValue = true;
        else if (token[key] !== undefined) updatedValue = false;
        return { ...prev, [key]: updatedValue };
      });
      setTimeout(() => {
        setMetricsChanges((prev) => ({ ...prev, [key]: null }));
      }, 800);
    };

    for (const metric of monitoredMetrics) {
      updateMetricsChange(metric);
    }
  }, [monitoredMetrics, token]);

  const url = `/asset/${getUrlFromName(token.name)}`;
  const addOrRemoveFromWatchlist = async () => {
    if (pathname.includes("watchlist")) {
      if (!activeWatchlist?.assets?.includes(token?.id)) {
        setShowAddedToWatchlist(true);
        setTokenToAddInWatchlist(token);
      } else {
        handleAddWatchlist(
          token.id,
          Number(activeWatchlist?.id),
          false,
          setIsLoading
        );
        setActiveWatchlist((prev) => ({
          ...prev,
          assets: prev?.assets
            ? prev.assets.filter((asset) => asset !== token.id)
            : [],
        }));
      }
    } else if (!inWatchlist) {
      setShowAddedToWatchlist(true);
      setTokenToAddInWatchlist(token);
    } else {
      setShowAddedToWatchlist(false);
      handleAddWatchlist(token?.id, watchlist?.id, false, setIsLoading);
    }
  };

  const value = useMemo(
    () => ({
      isHover,
      url,
    }),
    [isHover, url]
  );

  const renderSegments = () =>
    activeView?.display?.map((entry) => {
      switch (entry.type) {
        case "price":
          return (
            <PriceSegment
              token={token}
              display={entry.value}
              metricsChanges={metricsChanges}
              key={`price-${token.id}-${entry.value}`}
            />
          );
        case "change":
          return (
            <ChangeSegment
              token={token}
              display={entry.value}
              key={`change-${token.id}-${entry.value}`}
            />
          );
        case "market_cap":
          return (
            <MarketCapSegment
              metricsChanges={metricsChanges}
              token={token}
              display={entry.value}
              key={`mc-${token.id}-${entry.value}`}
            />
          );
        case "volume":
          return (
            <VolumeSegment
              metricsChanges={metricsChanges}
              token={token}
              display={entry.value}
              key={`volume-${token.id}-${entry.value}`}
            />
          );
        case "chart":
          return (
            <ChartSegment
              token={token}
              key={`chart-${token.id}-${entry.value}`}
            />
          );
        default:
          return null;
      }
    });

  const render = renderSegments();

  return (
    <EntryContext.Provider value={value}>
      <tbody
        className={`table-row-group border-b border-light-border-primary dark:border-dark-border-primary ${
          isHover
            ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
            : "bg-transparent dark:bg-transparent"
        } hover:cursor-pointer text-light-font-100 dark:text-dark-font-100 h-[75px] md:h-[60px]`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        ref={tableRef}
      >
        <tr className="text-light-font-100 dark:text-dark-font-100">
          <td
            className={`pl-5 md:pl-0 pr-0 max-w-auto sm:max-w-[35px] sticky left-0 z-[2] py-[25px] lg:py-[0px] ${
              isHover
                ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
                : "bg-light-bg-table dark:bg-dark-bg-table"
            }`}
          >
            <WatchlistAdd
              addOrRemoveFromWatchlist={addOrRemoveFromWatchlist}
              setAddedToWatchlist={setAddedToWatchlist}
              addedToWatchlist={addedToWatchlist}
              token={token}
            />
            <div className="w-fit hidden md:block">
              <button
                className="h-full px-[5px] py-2"
                onClick={() => {
                  setShowMenuTableMobile(true);
                  setShowMenuTableMobileForToken(token);
                }}
              >
                <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100 text-lg" />
              </button>
            </div>
          </td>
          <Segment
            extraCss={`py-2.5 min-w-[190px]  md:min-w-[125px] sticky left-[73px] md:left-[28px] z-[9] md:pr-1 ${
              isHover
                ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
                : "bg-transparent dark:bg-transparent"
            } md:pl-0`}
          >
            <TokenInfo token={token} showRank={showRank} index={index} />
          </Segment>
          {(activeView?.display?.length || 0) > 0 &&
          activeView?.name !== "All" &&
          activeView?.name !== "Portfolio"
            ? render
            : null}
          {activeView?.name === "Portfolio" || activeView?.name === "All" ? (
            <>
              <PriceSegment
                token={token}
                metricsChanges={metricsChanges}
                display="Price USD"
              />
              <ChangeSegment
                token={token}
                display="24h %"
                extraCss="md:hidden "
              />
              {activeView?.name === "All" ? (
                <ChangeSegment
                  token={token}
                  display="24h %"
                  extraCss="hidden md:table-cell"
                />
              ) : (
                <VolumeSegment
                  token={token}
                  metricsChanges={metricsChanges}
                  display="Balance"
                  extraCss="hidden md:table-cell"
                />
              )}
              <MarketCapSegment
                token={token}
                metricsChanges={metricsChanges}
                display="Market Cap"
                extraCss="md:hidden"
              />
              <VolumeSegment
                token={token}
                metricsChanges={metricsChanges}
                display="24h Volume"
                extraCss="md:hidden"
              />
              <ChartSegment token={token} extraCss="md:hidden" />
            </>
          ) : null}
          <td className="table-cell md:hidden">
            <div className="flex items-center justify-end pr-5">
              {token.contracts && token.contracts.length > 0 && (
                <Button
                  extraCss="px-0 w-[28px] h-[28px]"
                  onClick={() => {
                    setShowBuyDrawer(token);
                    pushData("Swap", {
                      name: "Swap Drawer",
                      from_page: pathname,
                      asset: token?.name,
                    });
                  }}
                >
                  <AiOutlineSwap className="text-light-font-60 dark:text-dark-font-60 text-lg rotate-90" />
                </Button>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </EntryContext.Provider>
  );
};
