import { Metadata } from "next";
import React from "react";
import { Movers } from "../../features/data/movers";
import { createSupabaseDOClient } from "../../lib/supabase";

async function fetchMoversAssets() {
  const settings = {
    liquidity: 1000,
    volume: 1000,
    onChainOnly: false,
    default: true,
    trustScore: 2,
    marketScore: 2,
    socialScore: 2,
    utilityScore: 2,
  };
  const supabase = createSupabaseDOClient();

  const q1 = supabase
    .from("assets")
    .select(
      "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap, price, rank,contracts,blockchains"
    )
    .gte("liquidity", settings.liquidity)
    .gte("volume", settings.volume)
    .or(`market_score.eq.0,market_score.gte.${settings.marketScore}`)
    .or(`trust_score.eq.0,trust_score.gte.${settings.trustScore}`)
    .or(`utility_score.eq.0,utility_score.gte.${settings.utilityScore}`)
    .or(`social_score.eq.0,social_score.gte.${settings.socialScore}`)
    .gte("price_change_24h", 0)
    .order("price_change_24h", { ascending: false })
    .match({ tracked: true })
    .limit(100);

  const q2 = supabase
    .from("assets")
    .select(
      "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap, price, rank,contracts,blockchains"
    )
    .gte("liquidity", settings.liquidity)
    .gte("volume", settings.volume)
    .lte("price_change_24h", 0)
    .order("price_change_24h", { ascending: true })
    .match({ tracked: true })
    .limit(100);

  const [{ data: gainers }, { data: losers }] = await Promise.all([q1, q2]);

  return {
    gainers: gainers || [],
    losers: losers || [],
  };
}

export const metadata: Metadata = {
  title: "Biggest Crypto Gainers and Losers Today | Mobula",
  description:
    "Discover the biggest crypto movers of the day, their real time price, chart, liquidity, and more.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula crypto, Mobula Crypto Data Aggregator, crypto movers, crypto gainers, crypto losers",
};

export default async function MoversPage() {
  const data = await fetchMoversAssets();
  return (
    <>
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/movers.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/movers.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Cryptocurrency/movers.png"
      />
      <meta name="url" content="https://mobula.fi/movers" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <Movers gainersBuffer={data.gainers} losersBuffer={data.losers} />
    </>
  );
}
