"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiFillStar, AiOutlineStar, AiOutlineSwap } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TbBellRinging } from "react-icons/tb";
import { NextImageFallback } from "../../../components/image";
import { WatchlistContext } from "../../../contexts/pages/watchlist";
import { PopupStateContext, PopupUpdateContext } from "../../../contexts/popup";
import { SettingsMetricContext } from "../../../contexts/settings";
import { UserContext } from "../../../contexts/user";
import { defaultTop100 } from "../../../features/data/top100/constants";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { Asset } from "../../../interfaces/assets";
import { IWatchlist } from "../../../interfaces/pages/watchlist";
import { useColors } from "../../../lib/chakra/colorMode";
import { pushData } from "../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../lib/supabase";
// import { PriceAlertPopup } from "../../../components/popup/price-alert/indext";
import React from "react";
import { Button } from "../../../components/button";
import { Spinner } from "../../../components/spinner";
import { useIsInViewport } from "../../../hooks/viewport";
import { getUrlFromName } from "../../../utils/formaters";
import { EntryContext, TableContext } from "../context-manager";
import { useWatchlist } from "../hooks/watchlist";
import { TableAsset } from "../model";
import { getCountdown } from "../utils";
import { Segment } from "./segment";
import { ChangeSegment } from "./segments/change";
import { ChartSegment } from "./segments/chart";
import { MarketCapSegment } from "./segments/market_cap";
import { PriceSegment } from "./segments/price";
import { VolumeSegment } from "./segments/volume";
import { TokenInfo } from "./ui/token";

interface EntryProps {
  token: TableAsset;
  index: number;
  isTop100?: boolean;
  isMobile?: boolean;
  showRank?: boolean;
}

export const Entry = ({
  token: tokenBuffer,
  index,
  isTop100,
  isMobile,
  showRank = false,
}: EntryProps) => {
  const entryRef = useRef<HTMLTableSectionElement>(null);
  const router = useRouter();
  const [token, setToken] = useState<TableAsset>(tokenBuffer);
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const page = params.page;
  const isBalance =
    Object.keys(token).includes("balance") &&
    (pathname === "/" || pathname === "/?page=" + page);

  const {
    text60,
    borders,
    boxBg3,
    bgMain,
    bgTable,
    hover,
    boxBg6,
    bordersActive,
    text80,
    text40,
  } = useColors();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const isVisible = useIsInViewport(entryRef);
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
  const { showAlert } = useContext(PopupStateContext);
  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
  } = useContext(PopupUpdateContext);
  const { inWatchlist, handleAddWatchlist } = useWatchlist(token.id);
  const { lastColumn } = useContext(TableContext);
  const { showBuyDrawer, setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { activeView } = useTop100();
  const [show, setShow] = useState(false);

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
    Chart: token.id ? (
      <div className="w-[135px] h-[45px]">
        <NextImageFallback
          width={135}
          height={45}
          alt={`${token.name} sparkline`}
          src={
            `https://mobula-assets.s3.eu-west-3.amazonaws.com/sparklines/${token.id}/24h.png` ||
            "/404/sparkline.png"
          }
          fallbackSrc="/404/sparkline.png"
          priority={index < 4}
          unoptimized
        />
      </div>
    ) : (
      isBalance && (
        <button
          className="ml-[30px] md:ml-0 w-[80%] md:w-full text-xs transition-all duration-250 ease-in-out border
           border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary 
           dark:bg-dark-bg-terciary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
           text-light-font-100 dark:text-dark-font-100 font-medium"
          onClick={() =>
            router.push(token.name !== "Mobula" ? "/list" : "/earn")
          }
        >
          {token.name !== "Mobula" ? "List this asset" : "Earn MOBL"}
        </button>
      )
    ),
    Added: getCountdown(Date.now() - new Date(token.created_at).getTime()),
  };

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        const supabase = createSupabaseDOClient();
        supabase
          .from("assets")
          .select(
            "price,market_cap,global_volume,rank,created_at,price_change_24h"
          )
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
      }, 5000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [isVisible, token]);

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

  const getBackgroundFromTable = () => {
    if (isTop100 && !isHover) return "bg-light-bg-table dark:bg-dark-bg-table";
    if (isTop100 && isHover)
      return "bg-light-bg-secondary dark:bg-dark-bg-secondary";
    if (!isTop100 && isHover)
      return "bg-light-bg-secondary dark:bg-dark-bg-secondary";
    return "bg-light-bg-primary dark:bg-dark-bg-primary";
  };

  const background = getBackgroundFromTable();

  const showMinimalMobile =
    (isMobile &&
      JSON.stringify(activeView?.display) ===
        JSON.stringify(defaultTop100.display) &&
      JSON.stringify(activeView?.filters) ===
        JSON.stringify(defaultTop100.filters)) ||
    (activeView?.name === "Portfolio" && isMobile);

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
              display="Chart"
              key={`chart-${token.id}-${entry.value}`}
            />
          );
        default:
          return null;
      }
    });

  return (
    <EntryContext.Provider value={value}>
      {showMinimalMobile ? (
        <tbody
          className={` ${
            isHover
              ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
              : "bg-transparent dark:bg-transparent"
          } hover:cursor-pointer text-light-font-100 dark:text-dark-font-100`}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          ref={entryRef}
        >
          <tr className="hidden lg:table-row text-light-font-100 dark:text-dark-font-100">
            <Segment
              extraCss={`pl-2.5 pr-0 max-w-auto md:max-w-5 sm:max-w-[35px] sticky left-0 z-[2] py-[20px] lg:py-[5px] ${background}`}
              noLink
            >
              <div className="flex items-center justify-center md:hidden">
                {isLoading ? (
                  <Spinner extraCss="w-[15px] h-[15px]" />
                ) : (
                  <>
                    {inWatchlist || addedToWatchlist ? (
                      <AiFillStar
                        className="text-yellow dark:text-yellow text-sm"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-light-font-40 dark:text-dark-font-40 text-sm"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    )}
                  </>
                )}
                <div className="ml-[5px] opacity-60 text-light-font-100 dark:text-dark-font-100">
                  {token.rank}
                </div>
              </div>
              <div className="w-fit hidden md:block">
                <Button
                  className="px-[5px] py-2"
                  onClick={() => {
                    setShowMenuTableMobile(true);
                    setShowMenuTableMobileForToken(token);
                  }}
                >
                  <BsThreeDotsVertical className="text-light-font-40 dark:text-dark-font-40 text-lg" />
                </Button>
              </div>
            </Segment>
            <Segment
              extraCss={`py-2.5 max-w-[190px] sm:max-w-[120px] sticky w-fit left-[70px] md:left-[24px] ${background}`}
            >
              <TokenInfo
                token={token as Asset}
                showRank={showRank}
                index={index}
              />
            </Segment>
            <PriceSegment
              token={token}
              metricsChanges={metricsChanges}
              display="Price USD"
            />
            {activeView?.name === "Portfolio" ? (
              <VolumeSegment
                token={token}
                metricsChanges={metricsChanges}
                display="24h Volume"
              />
            ) : (
              <ChangeSegment token={token} display="24h %" />
            )}
          </tr>
        </tbody>
      ) : (
        <tbody
          className={`border-b border-light-border-primary dark:border-dark-border-primary ${
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
              extraCss={`pl-2.5 sm:pl-[5px] pr-0 sm:pr-2.5 max-w-auto md:max-w-5 sm:max-w-[35px] sticky left-0 z-[2] py-[30px] lg:py-[5px] ${background}`}
              noLink
            >
              <div className="items-center justify-center flex md:hidden">
                {isLoading ? (
                  <Spinner extraCss="w-[15px] h-[15px]" />
                ) : (
                  <>
                    {inWatchlist || addedToWatchlist ? (
                      <AiFillStar
                        className="text-yellow dark:text-yellow text-sm"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    ) : (
                      <AiOutlineStar
                        className="text-light-font-60 dark:text-dark-font-60 text-sm"
                        onClick={() => {
                          addOrRemoveFromWatchlist();
                          setAddedToWatchlist(!addedToWatchlist);
                        }}
                      />
                    )}
                  </>
                )}
                <div className="ml-[5px] opacity-60 text-light-font-100 dark:text-dark-font-100">
                  {token.rank}
                </div>
              </div>
              <div className="w-fit hidden md:block">
                <Button
                  extraCss="h-full px-[5px] py-2"
                  onClick={() => {
                    setShowMenuTableMobile(true);
                    setShowMenuTableMobileForToken(token);
                  }}
                >
                  <BsThreeDotsVertical className="text-light-font-40 dark:text-dark-font-40 text-lg" />
                </Button>
              </div>
            </Segment>
            <Segment
              // max-w-[190px] lg:max-w-[150px] md:max-w-[100px] sm:max-w-[160px]
              extraCss={`py-2.5 min-w-[190px] lg:min-w-[180px] md:min-w-[185px] min-w-[125px] sticky left-[73px] md:left-[32px] z-[1] ${background}`}
            >
              <TokenInfo
                token={token as Asset}
                showRank={showRank}
                index={index}
              />
            </Segment>
            {(activeView?.display?.length || 0) > 0 &&
            (pathname === "/" || pathname === "/?page=" + page) ? (
              renderSegments()
            ) : (
              <>
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
                {pathname === "/" ||
                pathname === `/?page=${page}` ||
                isBalance ? (
                  <ChartSegment token={token} display="Chart" />
                ) : null}
              </>
            )}
            {pathname !== "/" && pathname !== `/?page=${page}` ? (
              <Segment>{lastComponent[lastColumn]}</Segment>
            ) : null}
            <Segment extraCss="table-cell" noLink>
              <div className="flex items-center justify-end">
                <Button
                  extraCss="px-0 w-[28px] h-[28px] mr-[5px]"
                  onClick={() => {
                    setShow(true);
                    pushData("Interact", {
                      name: "Alert Asset",
                      from_page: pathname,
                      asset: token?.name,
                    });
                  }}
                >
                  <TbBellRinging className="text-light-font-60 dark:text-dark-font-60 text-lg" />
                </Button>
                {token.contracts && token.contracts.length > 0 && (
                  <Button
                    extraCss="px-0 w-[28px] h-[28px]"
                    onClick={() => {
                      setShowBuyDrawer(token as Asset);
                      pushData("Interact", {
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
      )}
      {/* {show || (isMobile && showAlert === token?.name) ? (
        <PriceAlertPopup
          show={(show as any) || (showAlert as any)}
          setShow={setShow}
          asset={token as Asset}
        />
      ) : null} */}
    </EntryContext.Provider>
  );
};
