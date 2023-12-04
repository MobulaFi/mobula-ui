"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { default as React, useContext, useEffect, useState } from "react";
import { Container } from "../../../../../components/container";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { UserContext } from "../../../../../contexts/user";
import { EntryWatchlist } from "../../../../../layouts/tables/components/entry-watchlist";
import { HeaderWatchlist } from "../../../../../layouts/tables/components/header-watchlist";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { WatchlistContext } from "../../context-manager";
import { IWatchlist } from "../../models";
import { ButtonsHeader } from "../buttons-header";
interface WatchlistExploreProps {
  watchlistsBuffer: IWatchlist[];
  page: string;
}

export const WatchlistExplore = ({
  watchlistsBuffer,
  page,
}: WatchlistExploreProps) => {
  const { user } = useContext(UserContext);
  const [watchlistSearched, setWatchlistSearch] = useState([]);
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";
  const {
    setIsPageUserWatchlist,
    setPageSelected,
    pageSelected,
    setWatchlists,
    searchWatchlist,
    watchlists,
  } = useContext(WatchlistContext);
  const [tokens, setTokens] = useState([]);
  const [usersOwner, setUsersOwner] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setWatchlists(watchlistsBuffer);
  }, [watchlistsBuffer]);

  useEffect(() => {
    if (watchlists.length === 0) return;
    const supabase = createSupabaseDOClient();
    setIsPageUserWatchlist(false);
    setPageSelected(page);
    if (!searchWatchlist)
      supabase
        .from("users")
        .select("profile_pic,username,id,address")
        .in(
          "id",
          watchlists.map((wl) => wl.user_id)
        )
        .then((r) => {
          if (r.data) setUsersOwner(r.data);
        });
  }, [page, pageSelected, watchlists, searchWatchlist]);

  useEffect(() => {
    if (!searchWatchlist) return;
    const supabase = createSupabaseDOClient();
    const getFilteredWatchlist = async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*, users(profile_pic,username,address,id)")
        .ilike("name", `%${searchWatchlist}%`)
        .limit(15);
      if (error) {
        console.error("Error fetching watchlist:", error);
      } else {
        setWatchlistSearch(data);
        setUsersOwner(data.map((wl) => wl.users));
      }
    };

    getFilteredWatchlist();
  }, [searchWatchlist]);

  useEffect(() => {
    if (
      user &&
      user.watchlists_followed.length &&
      user.watchlists_followed.length !== watchlists.length &&
      pathname === "/watchlist/followed"
    ) {
      const supabase = createSupabaseDOClient();
      supabase
        .from("watchlist")
        .select("*, users(profile_pic,username,address,id)")
        .in("id", user.watchlists_followed)
        .then((r) => {
          if (r.data) {
            setWatchlists(r.data);
            setUsersOwner(r.data.map((wl) => wl.users));
          }
        });
    }
  }, [user, watchlists, searchWatchlist]);

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    let assetIds;

    if (searchWatchlist.length > 0) {
      assetIds = watchlistSearched?.map(
        (wl) => wl.assets?.map((asset) => asset) || []
      );
    } else {
      assetIds = watchlists?.map(
        (wl) => wl.assets?.map((asset) => asset) || []
      );
    }

    if (assetIds.length > 0) {
      const promises = assetIds.map((assetId) =>
        supabase
          .from("assets")
          .select(
            "price, name, symbol,global_volume, logo, id, market_cap, price_change_24h, social_score, trust_score, utility_score"
          )
          .in("id", assetId)
      );
      Promise.all(promises).then((responses) => {
        setTokens(responses.map((response) => response.data));
        setIsLoading(false);
      });
    } else {
      setTokens([]);
    }
  }, [watchlists, searchWatchlist]);

  return (
    <Container extraCss="w-[90%] lg:w-[95%]">
      <ButtonsHeader />
      {/* <Header
        assets={watchlists.map((entry) => entry.assets) as unknown as Asset[]}
        activeWatchlist={watchlists}
      /> */}
      <div className="overflow-auto relative top-0 w-full">
        <div className="mx-auto flex flex-col items-center relative overflow-auto top-0 scroll">
          <table className="w-full md:w-auto min-w-full md:min-w-[900px] cursor-pointer mx-auto relative">
            <thead
              className="border-t border-light-border-primary dark:border-dark-border-primary sticky top-0 text-light-font-60 
            dark:text-dark-font-60 "
            >
              <HeaderWatchlist />
            </thead>
            {(!searchWatchlist.length ? watchlistsBuffer : watchlistSearched)
              ?.filter((entry) => entry?.assets?.length > 0)
              .map((watchlist, i) => (
                <EntryWatchlist
                  key={watchlist?.id || i}
                  watchlist={watchlist}
                  tokens={tokens}
                  usersOwner={usersOwner}
                  isLoading={isLoading}
                  i={i}
                />
              ))}
          </table>
        </div>
      </div>
      {((page !== "Explorer" &&
        (watchlistsBuffer?.length === 0 || !watchlistsBuffer?.[0]?.assets)) ||
        (!watchlistSearched?.length && page === "Explorer")) &&
      !isLoading ? (
        <div
          className="flex items-center justify-center flex-col border border-t-0 border-light-border-primary
         dark:border-dark-border-primary pb-[50px] rounded-b"
        >
          <img
            className={`${
              isWhiteMode
                ? "mt-[40px] w-[150px] md:w-[110px]"
                : "mt-0 w-[250px] md:w-[180px]"
            }`}
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            alt="empty state"
          />
          <MediumFont
            extraCss={`${isWhiteMode ? "mt-[15px]" : "mt-[-20px]"} text-center`}
          >
            No Watchlist Followed
          </MediumFont>
          <SmallFont extraCss="text-center text-light-font-40 dark:text-dark-font-40 w-[90%] max-w-[340px]">
            Search for your favorite watchlists or find new ones by using{" "}
            <NextChakraLink href="/watchlist/explore">explore</NextChakraLink>{" "}
            feature.
          </SmallFont>
        </div>
      ) : null}
    </Container>
  );
};
