"use client";
import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container } from "../../../components/container";
import { UserContext } from "../../../contexts/user";
import { OrderBy } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { AssetsTable } from "../../../layouts/tables/components";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { ButtonsHeader } from "./components/buttons-header";
import { Header } from "./components/header";
import { AddCoinPopup } from "./components/popup/add-coin";
import { CreatePopup } from "./components/popup/create-watchlist";
import { EditPopup } from "./components/popup/edit";
import { SharePopup } from "./components/popup/share";
import { SkeletonTable } from "./components/skeleton";
import { WatchlistContext } from "./context-manager";
import { IWatchlist } from "./models";

interface WatchlistProps {
  isMobile: boolean;
  watchlist: IWatchlist;
}

export const Watchlist = ({ isMobile, watchlist }: WatchlistProps) => {
  const watchlistRefs = useRef([]);
  const supabase = createSupabaseDOClient();
  const [loaded, setLoaded] = useState(false);
  const { user } = useContext(UserContext);
  const {
    activeWatchlist,
    setActiveWatchlist,
    setIsPageUserWatchlist,
    setShowCreateWL,
    tokens,
    setTokens,
    resultsData,
    setResultsData,
  } = useContext(WatchlistContext);
  // const [resultsData, setResultsData] = useState({data: [], count: 0});

  useEffect(() => {
    if (user?.main_watchlist) {
      setIsPageUserWatchlist(false);
      setActiveWatchlist(user.main_watchlist);
    }
  }, [user?.main_watchlist]);

  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "price_change_24h",
    ascending: false,
    first: true,
  });

  useEffect(() => {
    const watchlistPath = {
      url: "/watchlist",
      name: "Watchlist",
      theme: "Crypto",
    };

    localStorage.setItem("path", JSON.stringify(watchlistPath));
  }, []);

  useEffect(() => {
    if (user && activeWatchlist) {
      supabase
        .from("assets")
        .select(
          "id,name,price_change_24h,volume,off_chain_volume,global_volume,symbol,logo,market_cap,price,liquidity,rank,contracts,blockchains,twitter,website,created_at",
          { count: "exact" }
        )
        .in("id", activeWatchlist.assets)
        .then((r) => {
          if (r.data) {
            setTokens(r.data);
            setResultsData({ data: r.data, count: r.count as number });
          }
        });
    }
  }, [activeWatchlist, supabase, user]);

  useEffect(() => {
    if (user?.watchlist && watchlistRefs) {
      watchlistRefs.current = user.watchlist.map(() => createRef());
    }
  }, [loaded, user?.watchlist]);

  return (
    <>
      {isMobile ? <TopNav list={tabs} active="Watchlist" isGeneral /> : null}
      <Container extraCss="w-[90%] lg:w-[95%] mb-[100px]">
        <ButtonsHeader />
        <Header
          assets={tokens}
          activeWatchlist={activeWatchlist as IWatchlist}
          setActiveWatchlist={setActiveWatchlist as never}
          setShowCreateWL={setShowCreateWL}
        />
        {activeWatchlist ||
        activeWatchlist?.assets.length > 0 ||
        tokens?.length > 0 ? (
          <AssetsTable
            resultsData={resultsData}
            setResultsData={setResultsData as never}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            isMobile={isMobile}
          />
        ) : null}
        {!activeWatchlist &&
        !activeWatchlist?.assets.length &&
        (tokens?.length || 0) === 0 ? (
          <SkeletonTable />
        ) : null}
        <SharePopup watchlist={activeWatchlist as IWatchlist} />
        <EditPopup watchlist={activeWatchlist} />
        <AddCoinPopup watchlist={activeWatchlist as IWatchlist} />
        <CreatePopup watchlist={activeWatchlist} />
      </Container>
    </>
  );
};
