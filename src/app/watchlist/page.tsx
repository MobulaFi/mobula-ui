/* eslint-disable react-hooks/rules-of-hooks */
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import React from "react";
import { Watchlist } from "../../features/user/watchlist";
import { IWatchlist } from "../../features/user/watchlist/models";
import { UserExtended } from "../../interfaces/user";
import { createSupabaseDOClient } from "../../lib/supabase";

async function fetchWatchlist() {
  const cookieStore = cookies();
  const addressCookie = cookieStore.get("address")?.value;
  const userAgent = headers["user-agent"];
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  const supabase = createSupabaseDOClient();

  const { data: userData } = await supabase
    .from<UserExtended>("users")
    .select(
      "id,address,watchlists_followed,external_wallets,tags,username,telegram,telegram_id,discord,claimed,visits,streaks,balance,profile_pic,nft,profile_pic,nft,nft_id,timezone_offset,twitter,notifications_history,quests_done,quests_pending,vouched_by,hidden_profile,level,xp,banner,achievements,total_tx,stacked_mobl,watchlist(*),portfolios(id,wallets,removed_transactions,removed_assets),views(*)"
    )
    .eq("address", addressCookie)
    .single();

  const activeWatchlist =
    userData?.watchlist.find((e) => e.main_watchlist) || userData?.watchlist[0];

  const { data } = await supabase
    .from("assets")
    .select(
      "id,name,price_change_24h,volume,off_chain_volume,global_volume,symbol,logo,market_cap,price,liquidity,rank,contracts,blockchains,twitter,website,chat,created_at",
      { count: "exact" }
    )
    .in("id", activeWatchlist?.assets || []);

  if (data)
    return {
      isMobile,
      watchlist: data || [],
    };
  return {
    isMobile,
    watchlist: [],
  };
}

export const metadata: Metadata = {
  title: " Manage Your Crypto Watchlist - ROI Analysis, Tracking | Mobula",
  description:
    "Take control of your crypto investments with our powerful watchlist manager. Analyze ROI, track growth, and optimize your portfolio for maximum returns.",
  keywords:
    "Mobula, Mobula watchlist, watchlist tracker, crypto watchlist, watchlist, crypto",
  robots: "index, follow",
};

export default async function WatchlistPage() {
  const data = await fetchWatchlist();
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
      <meta name="url" content="https://mobula.fi/watchlist" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <Watchlist
        isMobile={data.isMobile}
        watchlist={data.watchlist as IWatchlist}
      />
    </>
  );
}
