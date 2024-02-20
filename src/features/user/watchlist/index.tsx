"use client";
import { Button } from "components/button";
import { PopupUpdateContext } from "contexts/popup";
import { pushData } from "lib/mixpanel";
import { createRef, useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Container } from "../../../components/container";
import { LargeFont } from "../../../components/fonts";
import { NextChakraLink } from "../../../components/link";
import { UserContext } from "../../../contexts/user";
import { OrderBy } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { BasicBody } from "../../../layouts/new-tables/basic-table/basic-body";
import { CommonTableHeader } from "../../../layouts/new-tables/basic-table/basic-wrap";
import { SkeletonTable } from "../../../layouts/new-tables/skeleton-table";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { Header } from "./components/header";
import { AddCoinPopup } from "./components/popup/add-coin";
import { CreatePopup } from "./components/popup/create-watchlist";
import { EditPopup } from "./components/popup/edit";
import { SharePopup } from "./components/popup/share";
import { WatchlistContext } from "./context-manager";
import { IWatchlist } from "./models";

interface WatchlistProps {
  isMobile: boolean;
  watchlist: IWatchlist;
}

export const Watchlist = ({ isMobile, watchlist }: WatchlistProps) => {
  const watchlistRefs = useRef([]);
  const supabase = createSupabaseDOClient();
  const { user } = useContext(UserContext);
  const { isDisconnected, isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);
  const [isLoading, setIsLoading] = useState(true);
  const {
    activeWatchlist,
    setActiveWatchlist,
    setIsPageUserWatchlist,
    setShowCreateWL,
    tokens,
    setTokens,
    resultsData,
    setShowAddCoins,
    setResultsData,
  } = useContext(WatchlistContext);

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
            setIsLoading(false);
          }
        });
    }
    if (isDisconnected) {
      setIsLoading(false);
      return;
    }
  }, [activeWatchlist, isDisconnected, user]);

  useEffect(() => {
    if (user?.watchlist && watchlistRefs) {
      watchlistRefs.current = user.watchlist.map(() => createRef());
    }
  }, [user?.watchlist]);

  return (
    <>
      {isMobile ? <TopNav list={tabs} active="Watchlist" isGeneral /> : null}
      <Container extraCss="w-[90%] lg:w-[95%] mb-[100px]">
        <div className="flex items-center">
          <NextChakraLink href="/watchlist" extraCss="mb-0">
            <LargeFont extraCss="cursor-pointer mb-0">Watchlists</LargeFont>
          </NextChakraLink>
        </div>
        <Header
          assets={tokens}
          activeWatchlist={activeWatchlist as IWatchlist}
          setActiveWatchlist={setActiveWatchlist}
          setShowCreateWL={setShowCreateWL}
        />
        <CommonTableHeader orderBy={orderBy} setOrderBy={setOrderBy}>
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <SkeletonTable
                  isWatchlist
                  i={i}
                  key={i}
                  isNews={false}
                  isTable={false}
                  isWatchlistLoading={isLoading}
                />
              ))
            : null}
          {!isLoading && tokens?.length > 0 ? (
            <>
              {resultsData?.data?.map((token, i) => (
                <BasicBody token={(token as any) || {}} index={i} />
              ))}
            </>
          ) : null}
          {!isLoading && !tokens?.length && isConnected ? (
            <caption className="h-[400px] w-full">
              <LargeFont extraCss="mt-[100px] font-normal">
                No results found
              </LargeFont>
              <Button
                extraCss="mt-5"
                onClick={() => {
                  pushData("Add Assets From Watchlist", {});
                  setShowAddCoins(true);
                }}
              >
                Add Asset to Watchlist
              </Button>
            </caption>
          ) : null}
          {isDisconnected ? (
            <caption className="h-[400px] w-full">
              <LargeFont extraCss="mt-[100px] font-normal">
                Please connect your wallet <br /> to view your watchlist
              </LargeFont>
              <Button extraCss="mt-5" onClick={() => setConnect(true)}>
                Connect
              </Button>
            </caption>
          ) : null}
        </CommonTableHeader>
        <SharePopup watchlist={activeWatchlist as IWatchlist} />
        <EditPopup watchlist={activeWatchlist as IWatchlist} />
        <AddCoinPopup watchlist={activeWatchlist as IWatchlist} />
        <CreatePopup watchlist={activeWatchlist as IWatchlist} />
      </Container>
    </>
  );
};
