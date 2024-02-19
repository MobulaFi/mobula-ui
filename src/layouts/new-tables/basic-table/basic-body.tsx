"use client";
import { SmallFont } from "components/fonts";
import { useParams, usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "../../../components/button";
import { NextImageFallback } from "../../../components/image";
import { WatchlistContext } from "../../../contexts/pages/watchlist";
import { PopupUpdateContext } from "../../../contexts/popup";
import { SettingsMetricContext } from "../../../contexts/settings";
import { UserContext } from "../../../contexts/user";
import { IWatchlist } from "../../../interfaces/pages/watchlist";
import { pushData } from "../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { getUrlFromName } from "../../../utils/formaters";
import { EntryContext, TableContext } from "../context-manager";
import { useWatchlist } from "../hooks/watchlist";
import { TableAsset } from "../model";
import { Segment } from "../segments";
import { ChangeSegment } from "../segments/change";
import { MarketCapSegment } from "../segments/market_cap";
import { PriceSegment } from "../segments/price";
import { VolumeSegment } from "../segments/volume";
import { TokenInfo } from "../ui/token";
import { WatchlistAdd } from "../ui/watchlist";
import { getCountdown } from "../utils";

interface EntryProps {
  token: TableAsset;
  index: number;
  isTop100?: boolean;
  isMobile?: boolean;
  showRank?: boolean;
  isTrending?: boolean;
}

export const BasicBody = ({
  token: tokenBuffer,
  index,
  isMobile: nullValue,
  showRank = false,
  isTrending = false,
}: EntryProps) => {
  const entryRef = useRef<HTMLTableSectionElement>(null);
  const [token, setToken] = useState<TableAsset>(tokenBuffer);
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const page = params.page;
  const { user } = useContext(UserContext);
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
  const { lastColumn } = useContext(TableContext);
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
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
  const url = `/asset/${getUrlFromName(token.name)}`;

  const lastComponent = {
    Chart: (
      <div className="flex justify-end w-full h-[45px] z-[1]">
        <NextImageFallback
          width={135}
          height={45}
          alt={`${token.name} sparkline`}
          style={{ zIndex: 0, minWidth: "135px" }}
          src={
            `https://storage.googleapis.com/mobula-assets/sparklines/${token.id}/24h.png` ||
            "/empty/sparkline.png"
          }
          fallbackSrc="/empty/sparkline.png"
        />
      </div>
    ),
    Added: (
      <p className="text-light-font-100 dark:text-dark-font-100 whitespace-nowrap text-sm md:text-xs">
        {getCountdown(Date.now() - new Date(token.created_at).getTime())}
      </p>
    ),
  };

  const fetchPrice = () => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("price,market_cap,global_volume,rank,created_at,price_change_24h")
      .match({ id: token.id })
      .single()
      .then((r) => {
        if (
          r.data &&
          (r.data.price !== token.price ||
            r.data.global_volume !== token.global_volume ||
            r.data.market_cap !== token.market_cap ||
            r.data.rank !== token.rank)
        ) {
          setToken({
            ...token,
            price: r.data.price,
            priceChange:
              r.data.price !== token.price
                ? r.data.price > token.price
                : undefined,
            market_cap: r.data.market_cap,
            marketCapChange:
              r.data.market_cap !== token.market_cap
                ? r.data.market_cap > token.market_cap
                : undefined,
            volume: r.data.global_volume,
            rank: r.data.rank,
            volumeChange:
              r.data.global_volume !== token.global_volume
                ? r.data.global_volume > token.global_volume
                : undefined,
            price_change_24h: r.data.price_change_24h,
          });
        }
      });
  };

  useEffect(() => {
    if (token) {
      fetchPrice();
      const interval = setInterval(() => {
        fetchPrice();
      }, 5000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [token]);

  const addOrRemoveFromWatchlist = async () => {
    if (pathname.includes("watchlist")) {
      if (!activeWatchlist?.assets?.includes(token?.id)) {
        setShowAddedToWatchlist(true);
        setTokenToAddInWatchlist(token);
      } else {
        handleAddWatchlist(token.id, Number(activeWatchlist?.id), false);
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
      handleAddWatchlist(token?.id, watchlist?.id, false);
    }
  };

  const value = useMemo(
    () => ({
      isHover,
      url,
    }),
    [isHover, url]
  );

  return (
    <EntryContext.Provider value={value}>
      <tbody
        className={`table-row-group border-b border-light-border-primary dark:border-dark-border-primary ${
          isHover
            ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
            : "bg-transparent dark:bg-transparent"
        } hover:cursor-pointer text-light-font-100 dark:text-dark-font-100`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        ref={entryRef}
      >
        <tr className="text-light-font-100 dark:text-dark-font-100">
          <Segment
            extraCss={`pl-2.5 md:px-[0px] pr-0   max-w-auto sm:max-w-[35px] sticky left-0 z-[2] py-[30px] lg:py-[0px] ${
              isHover
                ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
                : "bg-light-bg-primary dark:bg-dark-bg-primary"
            }`}
            noLink
          >
            {isTrending ? (
              <div className="flex w-full justify-center pr-5">
                <SmallFont>
                  <span className="text-light-font-60 dark:text-dark-font-60">
                    #
                  </span>
                  {index + 1}
                </SmallFont>{" "}
              </div>
            ) : (
              <>
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
              </>
            )}
          </Segment>
          <Segment
            // max-w-[190px] lg:max-w-[150px] md:max-w-[100px] sm:max-w-[160px]
            extraCss={`py-2.5 min-w-[190px]  md:min-w-[125px] sticky left-[73px] md:left-[28px] z-[9] md:pr-1 ${
              isHover
                ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
                : "bg-light-bg-primary dark:bg-dark-bg-primary"
            } md:pl-0`}
          >
            <TokenInfo token={token} showRank={showRank} index={index} />
          </Segment>

          <PriceSegment
            token={token}
            metricsChanges={metricsChanges}
            display="Price USD"
          />
          <ChangeSegment token={token} display="24h %" />
          <MarketCapSegment
            token={token}
            metricsChanges={metricsChanges}
            display="Market Cap"
          />
          <VolumeSegment
            token={token}
            metricsChanges={metricsChanges}
            display="24h Volume"
          />
          <Segment>{lastComponent[lastColumn as string]}</Segment>
          <Segment extraCss="table-cell md:hidden" noLink>
            <div className="flex items-center justify-end">
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
          </Segment>
        </tr>
      </tbody>
    </EntryContext.Provider>
  );
};
