import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import { WatchlistExplore } from "../../../features/user/watchlist/components/explore";
import { createSupabaseDOClient } from "../../../lib/supabase";

const fetchWatchlistFollowed = async () => {
  const supabase = createSupabaseDOClient();
  const cookieStore = cookies();
  const addressCookie = cookieStore.get("address")?.value;
  const { data } = await supabase.rpc("get_watchlists_by_address", {
    user_address: addressCookie,
  });

  if (data && data[0]) {
    const watchlists = data.map((wl) => ({
      assets: wl.watchlist_assets,
      created_at: wl.watchlist_created_at,
      followers: wl.watchlist_followers,
      id: wl.watchlist_id,
      name: wl.watchlist_name,
      main_watchlist: wl.watchlist_main_watchlist,
      public: wl.watchlist_public,
      user_id: wl.watchlist_user_id,
    }));
    return {
      watchlists,
    };
  }
  return {
    watchlists: [],
  };
};

export const metadata: Metadata = {
  title: "Follow Top Crypto Traders Watchlists - Mobula",
  description:
    "Stay informed and follow the watchlists of the most successful crypto traders. Gain insights into their strategies and make informed investment decisions.",
  keywords:
    "Mobula, Mobula watchlist, watchlist followed, crypto watchlist, watchlist, crypto",
  robots: "index, follow",
};

export default async function followedWatchlist() {
  const data = await fetchWatchlistFollowed();
  return (
    <>
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta name="url" content="https://mobula.fi/watchlist/followed" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <WatchlistExplore watchlistsBuffer={data?.watchlists} page="Followed" />
    </>
  );
}
