import { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";
import { RecentlyAdded } from "../../features/data/recently-added";
import { createSupabaseDOClient } from "../../lib/supabase";

export const fetchCache = "force-no-store";

async function fetchNewAssets() {
  const supabase = createSupabaseDOClient();
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  const { data, count } = await supabase
    .from("assets")
    .select(
      "id,name,price_change_24h,global_volume,symbol,logo,market_cap,price,rank,contracts,blockchains,twitter,website,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .gt("price", 0)
    .limit(100);

  return {
    tokens: data || [],
    count: count || 0,
    isMobile,
  };
}

export const metadata: Metadata = {
  title: "New Cryptocurrencies listed today and this week on Mobula | Mobula",
  description:
    "Discover the assets recently added on Mobula, their real time price, chart, liquidity, and more.",
  robots: "index, follow",
  keywords:
    "Mobula, New Cryptocurrencies, New Tokens, New Coins, New Assets, mobula new, mobula recently added, mobula new coins, mobula new tokens, mobula new assets, mobula new cryptocurrencies, mobula new crypto, mobula new crypto assets, mobula new crypto coins, mobula new crypto tokens, mobula new crypto currencies, mobula new crypto currencies, mobula new crypto coins, mobula new crypto tokens, mobula",
};

export default async function recentlyAdded() {
  const data = await fetchNewAssets();
  return (
    <>
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta name="url" content="https://mobula.fi/new" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <RecentlyAdded
        tokensBuffer={data?.tokens || []}
        isMobile={data?.isMobile}
        count={data?.count}
      />
    </>
  );
}
