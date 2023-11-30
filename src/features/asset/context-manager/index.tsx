"use client";
import { PostgrestResponse } from "@supabase/supabase-js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../contexts/user";
import { ILaunchpad } from "../../../interfaces/launchpads";
import { MarketMetrics, TradeFilter } from "../../../interfaces/trades";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { Pref } from "../../../utils/prefs";
import { ComparedEntity } from "../../user/portfolio/models";
import {
  Asset,
  ChartType,
  FormattedHistoricalData,
  HistoryData,
  IBasetAssetContext,
  TimeSelected,
  Trade,
  UnformattedHistoricalData,
} from "../models";
import { formatHistoricalData } from "../utils";

interface BaseAssetProviderProps {
  token: Asset;
  children: React.ReactNode;
  pref: Pref;
  tradHistory: Trade[];
  launchpad?: ILaunchpad[];
  hideTxCookie: string;
  tradeCookie: TradeFilter[];
}

export const BaseAssetContext = React.createContext({} as IBasetAssetContext);

export const BaseAssetProvider = ({
  token,
  children,
  pref,
  tradHistory,
  launchpad,
  hideTxCookie,
  tradeCookie,
}: BaseAssetProviderProps) => {
  const [transactions, setTransactions] = useState([]);
  const [baseAsset, setBaseAsset] = useState<Asset>(token);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [formattedHistoricalData, setFormattedHistoricalData] =
    useState<FormattedHistoricalData | null>(null);
  const [unformattedHistoricalData, setUnformattedHistoricalData] =
    useState<UnformattedHistoricalData | null>(null);
  const [timeSelected, setTimeSelected] = useState<TimeSelected>("24H");
  const [hideTx, setHideTx] = useState(JSON.parse(hideTxCookie));
  const [tokenVsMarket, setTokenVsMarket] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [chartType, setChartType] = useState<ChartType>("price" as any);
  const [showTargetPrice, setShowTargetPrice] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState("Linear");
  const [wallet, setWallet] = useState(null);
  const [portfolios, setPortfolios] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketMetricsLoading, setIsMarketMetricsLoading] = useState(false);
  const [showTradeBlockchain, setShowTradeBlockchain] = useState(false);
  const [showTradeType, setShowTradeType] = useState(false);
  const [showTradeValue, setShowTradeValue] = useState(false);
  const [showTradeTokenAmount, setShowTradeTokenAmount] = useState(false);
  const [showTradeLiquidityPool, setShowTradeLiquidityPool] = useState(false);
  const [showSwap, setShowSwap] = useState(1); // 0 = hidden | 1 = show tab | 2 = show
  const [activeMetric, setActiveMetric] = useState("Metrics");
  const [showMobileMetric, setShowMobileMetric] = useState(false);
  const [showPopupSocialMobile, setShowPopupSocialMobile] = useState(false);
  const [showSeeAllTags, setShowSeeAllTags] = useState(false);
  const [showTradeFilters, setShowTradeFilters] = useState(false);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>();
  const [filters, setFilters] = useState(tradeCookie || []);
  const [shouldInstantLoad, setShouldInstantLoad] = useState(false);
  const [activeTab, setActiveTab] = useState("Essentials");
  const [tradeHistory, setTradeHistory] = useState(tradHistory);
  const [comparedEntities, setComparedEntities] = useState<ComparedEntity[]>(
    []
  );
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [launchpads, setLaunchpads] = useState<ILaunchpad[] | undefined[]>(
    (launchpad as ILaunchpad[]) || []
  );
  const [untracked, setUntracked] = useState({
    isUntracked: !token?.tracked,
    showChart: false,
  });

  let tradeFromCookie = {
    blockchains: [],
    value: [0, 1_000_000_000_000],
    type: null,
    token_amount: [0, 1_000_000_000_000],
    liquidity_pool: [],
  };

  const returnName = (prevValue, filter, values, value, anyState) => {
    let newValue = prevValue;
    if (filter.action === "gte" && values[0] === value)
      newValue = `${values[0]} - ${values[1]}`;
    else if (filter.action === "gte" && values[0] !== value)
      newValue = `${value} - ${values[1]}`;
    else if (filter.action === "lte" && values[1] === value)
      newValue = `${values[0]} - ${values[1]}`;
    else if (filter.action === "lte" && values[1] !== value)
      newValue = `${values[0]} - ${value}`;
    else newValue = anyState;
    return newValue;
  };

  tradeCookie?.forEach((filter) => {
    const value = filter.value?.[1];

    if ((filter?.value?.[0] as never) === "trade_history.type") {
      tradeFromCookie = {
        ...tradeFromCookie,
        type: filter.value[1],
      };
    }
    if ((filter.value[0] as never) === "trade_history.token_amount") {
      const amounts = [0, 1_000_000_000_000];
      const toArr = returnName("", filter, amounts, value, "Any Amount");
      const min = toArr.split(" - ")[0];
      const max = toArr.split(" - ")[1];
      tradeFromCookie = {
        ...tradeFromCookie,
        token_amount: [Number(min), Number(max)],
      };
    }
    if ((filter.value[0] as never) === "trade_history.value_usd") {
      const amounts = [0, 1_000_000_000_000];
      const toArr = returnName("", filter, amounts, value, "Any Value");
      const min = toArr.split(" - ")[0];
      const max = toArr.split(" - ")[1];
      tradeFromCookie = {
        ...tradeFromCookie,
        value: [Number(min), Number(max)],
      };
    }
  });

  const [selectedTradeFilters, setSelectedTradeFilters] =
    useState(tradeFromCookie);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    if (user) {
      supabase
        .from("portfolios")
        .select("*")
        .eq("user", user.id)
        .then((r) => {
          if (r.data) {
            setPortfolios(r.data);
          }
        });
    }
  }, [user]);

  // useEffect(() => {
  //   if (portfolios) {
  //     console.log("Refreshing portfolio useEffect portfolios");
  //     const socket = new WebSocket(
  //       process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT,
  //     );
  //     setIsLoading(true);
  //     socket.addEventListener("open", () => {
  //       socket.send(
  //         `{"portfolio": {"id": ${portfolios[0]?.id}}, "force": true}`,
  //       );
  //     });
  //     setIsLoading(true);
  //     socket.addEventListener("message", event => {
  //       try {
  //         if (JSON.parse(event.data) !== null) {
  //           const portfolio = JSON.parse(event.data);

  //           if (portfolio.status === "error") {
  //             setWallet(null);
  //             setError(
  //               "Invalid address. Mobula Portfolio does not support smart-contracts.",
  //             );
  //             setIsLoading(false);
  //             return;
  //           }

  //           setWallet(portfolio.portfolio);
  //         } else setWallet(null);
  //         setIsLoading(false);
  //       } catch (e) {
  //         setIsLoading(false);
  //       }
  //     });
  //   }
  // }, [portfolios]);

  const multiplier = 1;

  const generateNewBuffer = (
    recent?: [number, number][],
    history?: [number, number][]
  ): Record<TimeSelected, [number, number][] | undefined> => {
    const historyAssetBase = history
      ?.filter((entry) => Date.now() > entry[0] + 7 * 24 * 60 * 60 * 1000)
      .map((entry) => [entry[0], entry[1] * multiplier]) as [number, number][];

    const weeklyAsset = (recent
      ?.filter((entry) => entry[0] + 7 * 24 * 60 * 60 * 1000 > Date.now())
      .map((entry) => [entry[0], entry[1] * multiplier]) || []) as [
      number,
      number
    ][];

    return {
      "24H": weeklyAsset?.filter(
        (entry) => entry[0] + 24 * 60 * 60 * 1000 > Date.now()
      ),
      "7D": weeklyAsset,
      "30D": historyAssetBase
        ?.filter((entry) => entry[0] + 30 * 24 * 60 * 60 * 1000 > Date.now())
        .concat(weeklyAsset),
      "3M": historyAssetBase
        ?.filter((entry) => entry[0] + 90 * 24 * 60 * 60 * 1000 > Date.now())
        .concat(weeklyAsset),
      "1Y": historyAssetBase
        ?.filter((entry) => entry[0] + 365 * 24 * 60 * 60 * 1000 > Date.now())
        .concat(weeklyAsset),
      ALL: historyAssetBase?.concat(weeklyAsset),
    };
  };

  useEffect(() => {
    const fetchAssetData = async () => {
      const noCacheSupabase = createSupabaseDOClient({ noCache: true });
      const supabase = createSupabaseDOClient();
      const fetchPromise: any[] = [];

      fetchPromise.push(
        noCacheSupabase
          .from("assets")
          .select(
            "price_history,price,release_schedule,distribution,sales,listed_at,market_cap_change_24h,twitter_history,investors,market_cap_history,cexs,team,total_supply_contracts,circulating_supply_addresses,price_change_24h,volume_change_24h,volume,off_chain_volume,market_cap,market_cap_diluted,liquidity,total_supply,trade_history(*), assets_raw_pairs(pairs_data,pairs_per_chain),assets_social(*),rank,listing_amount,listing_hash,created_at,launch"
          )
          .limit(20, {
            foreignTable: "trade_history",
          })
          .order("date", { foreignTable: "trade_history", ascending: false })
          .match({ id: token.id })
      );

      fetchPromise.push(
        supabase
          .from("history")
          .select("price_history")
          .match({ asset: token.id })
      );

      fetchPromise.push(
        supabase
          .from("history")
          .select("market_cap_history")
          .match({ asset: token.id })
      );

      const [{ data }, history, marketHistory] = await Promise.all(
        fetchPromise
      );

      // console.log("dataaaaaa", marketHistory);

      if (data && data[0]) {
        setBaseAsset({ ...token, ...data[0] });

        const newUnformattedBuffer = generateNewBuffer(
          data[0].price_history.price,
          history?.data?.[0]?.price_history
        );

        const newUnformattedBufferMarket = generateNewBuffer(
          data[0].market_cap_history.market_cap,
          marketHistory?.data?.[0]?.market_cap_history
        );

        if (history?.data?.[0]) {
          setHistoryData((freshHistoryData) => ({
            ...(freshHistoryData || {}),
            price_history: history.data[0].price_history || [],
            market_history: marketHistory.data[0].market_cap_history || [],
          }));
        }

        setUnformattedHistoricalData({
          price: newUnformattedBuffer,
          market_cap: newUnformattedBufferMarket,
        });
        setFormattedHistoricalData(
          formatHistoricalData({
            price: newUnformattedBuffer,
            market_cap: newUnformattedBufferMarket,
          })
        );
      }
    };

    fetchAssetData();
  }, [token]);

  const value = useMemo(() => {
    const loadHistoryData = async (
      type: ChartType,
      time: TimeSelected
    ): Promise<void> => {
      const supabase = createSupabaseDOClient();
      const fetchPromise: (
        | PromiseLike<PostgrestResponse<any>>
        | Promise<null>
      )[] = [];

      if (!unformattedHistoricalData?.[type]) {
        fetchPromise.push(
          supabase
            .from("assets")
            .select(`${type}_history`)
            .match({ id: baseAsset.id })
        );
        // eslint-disable-next-line no-promise-executor-return
      } else fetchPromise.push(new Promise((resolve) => resolve(null)));

      if (time !== "24H" && time !== "7D") {
        fetchPromise.push(
          supabase
            .from("history")
            .select(`${type}_history`)
            .match({ asset: baseAsset.id })
        );
        // eslint-disable-next-line no-promise-executor-return
      } else fetchPromise.push(new Promise((resolve) => resolve(null)));

      const [recent, history] = await Promise.all(fetchPromise);

      if (history?.data?.[0])
        setHistoryData((freshHistoryData) => ({
          ...(freshHistoryData || {}),
          [`${type}_history`]: history.data[0][`${type}_history`] || [],
        }));

      if (recent?.data?.[0])
        setBaseAsset((freshBaseAsset) => ({
          ...freshBaseAsset,
          [`${type}_history`]: {
            [type]: recent.data[0][`${type}_history`][type] || [],
          },
        }));

      if (baseAsset && unformattedHistoricalData) {
        const newUnformattedBuffer = generateNewBuffer(
          recent?.data?.[0]?.[`${type}_history`][type] ||
            baseAsset[`${type}_history`]?.[type],
          history?.data?.[0]?.[`${type}_history`]
        );

        const newUnformattedHistoricalData = {
          ...unformattedHistoricalData,
          [type]: newUnformattedBuffer,
        };

        setUnformattedHistoricalData(newUnformattedHistoricalData);
        setFormattedHistoricalData(
          formatHistoricalData(newUnformattedHistoricalData)
        );
      }
    };

    const setUserActiveChart = (type: string) => {
      setActiveChart(type);
      // setUserPrefCookie({ ...pref, chartType: type });
    };

    const setUserTimeSelected = (value: TimeSelected) => {
      setTimeSelected(value);
      // setUserPrefCookie({ ...pref, timeSelected: value });
    };

    const setUserTradeAmountFilter = (value: TradeFilter) => {
      setSelectedTradeFilters(value);
      // setUserPrefCookie({ ...pref, liveTradeAmountFitlers: value });
    };

    const shouldLoadHistory = (type: ChartType, time: TimeSelected): boolean =>
      (!historyData?.[`${type}_history`] && time !== "24H" && time !== "7D") ||
      !baseAsset[`${type}_history`];

    return {
      baseAsset,
      setBaseAsset,
      transactions,
      setTransactions,
      historyData,
      setHistoryData,
      unformattedHistoricalData,
      setUnformattedHistoricalData,
      formattedHistoricalData,
      setFormattedHistoricalData,
      timeSelected,
      setTimeSelected,
      showTargetPrice,
      setShowTargetPrice,
      loadHistoryData,
      shouldLoadHistory,
      chartType,
      setChartType,
      setActiveChart,
      activeChart,
      wallet,
      portfolios,
      isLoading,
      setSelectedTradeFilters,
      selectedTradeFilters,
      showTradeBlockchain,
      setShowTradeBlockchain,
      showTradeLiquidityPool,
      setShowTradeLiquidityPool,
      showTradeTokenAmount,
      setShowTradeTokenAmount,
      showTradeType,
      setShowTradeType,
      showTradeValue,
      setShowTradeValue,
      showSwap,
      setShowSwap,
      activeMetric,
      setActiveMetric,
      setShowMobileMetric,
      showMobileMetric,
      setShowPopupSocialMobile,
      showPopupSocialMobile,
      setShowSeeAllTags,
      showSeeAllTags,
      setShowTradeFilters,
      showTradeFilters,
      marketMetrics,
      setMarketMetrics,
      filters,
      setFilters,
      setIsMarketMetricsLoading,
      isMarketMetricsLoading,
      untracked,
      setUntracked,
      setIsLoading,
      setShouldInstantLoad,
      shouldInstantLoad,
      setActiveTab,
      activeTab,
      setUserActiveChart,
      setUserTimeSelected,
      setUserTradeAmountFilter,
      setPairs,
      pairs,
      tradeHistory,
      setTradeHistory,
      setTokenVsMarket,
      tokenVsMarket,
      setHideTx,
      hideTx,
      comparedEntities,
      setComparedEntities,
      launchpads,
      setLaunchpads,
      timeRemaining,
      setTimeRemaining,
    };
  }, [
    baseAsset,
    setBaseAsset,
    transactions,
    setTransactions,

    historyData,
    setHistoryData,
    unformattedHistoricalData,
    setUnformattedHistoricalData,
    formattedHistoricalData,
    setFormattedHistoricalData,
    timeSelected,
    setTimeSelected,
    showTargetPrice,
    setShowTargetPrice,
    chartType,
    setChartType,
    setActiveChart,
    activeChart,
    wallet,
    portfolios,
    isLoading,
    setSelectedTradeFilters,
    selectedTradeFilters,
    showTradeBlockchain,
    setShowTradeBlockchain,
    showTradeLiquidityPool,
    setShowTradeLiquidityPool,
    showTradeTokenAmount,
    setShowTradeTokenAmount,
    showTradeType,
    setShowTradeType,
    showTradeValue,
    setShowTradeValue,
    showSwap,
    setShowSwap,
    activeMetric,
    setActiveMetric,
    setShowMobileMetric,
    showMobileMetric,
    setShowPopupSocialMobile,
    showPopupSocialMobile,
    setShowSeeAllTags,
    showSeeAllTags,
    setShowTradeFilters,
    showTradeFilters,
    marketMetrics,
    setMarketMetrics,
    filters,
    setFilters,
    setIsMarketMetricsLoading,
    isMarketMetricsLoading,
    untracked,
    setUntracked,
    setIsLoading,
    setShouldInstantLoad,
    shouldInstantLoad,
    setActiveTab,
    activeTab,
    setPairs,
    pairs,
    tradeHistory,
    setTradeHistory,
    setTokenVsMarket,
    tokenVsMarket,
    setHideTx,
    hideTx,
    comparedEntities,
    setComparedEntities,
    launchpads,
    setLaunchpads,
    timeRemaining,
    setTimeRemaining,
  ]);

  return (
    <BaseAssetContext.Provider value={value as never}>
      {children}
    </BaseAssetContext.Provider>
  );
};
