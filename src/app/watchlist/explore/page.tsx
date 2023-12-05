import { Metadata } from "next";
import React from "react";
import { WatchlistExplore } from "../../../features/user/watchlist/components/explore";
import { createSupabaseDOClient } from "../../../lib/supabase";

async function fetchTopWatchlist() {
  const supabase = createSupabaseDOClient();
  const { data } = await supabase.rpc("get_top_watchlists", {
    limit_count: 15,
  });

  if (data && data[0])
    return {
      watchlists: data,
    };
  return {
    watchlists: [],
  };
}

export const metadata: Metadata = {
  title: "Discover Potential Gems and Top Cryptocurrencies - Mobula",
  description:
    "Explore the best watchlists featuring promising cryptocurrencies and hidden gem tokens. Stay ahead in the crypto market with our curated collection.",
  keywords:
    "Mobula, Mobula watchlist, watchlist followed, crypto watchlist, watchlist, crypto",
  robots: "index, follow",
};

export default async function ExplorePage() {
  const data = await fetchTopWatchlist();
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
      <meta name="url" content="https://mobula.fi/watchlist/explore" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <WatchlistExplore watchlistsBuffer={data.watchlists} page="Explore" />
    </>
  );
}
