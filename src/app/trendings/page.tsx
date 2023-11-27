import React from "react";
import Trendings from "../../features/data/trending";

// async function fetchTrendingsAssets() {
//   const supabase = createSupabaseDOClient();
//   const cookieStore = cookies();
//   const userAgent: string = headers().get("user-agent") || "";
//   const settings = {
//     liquidity: 0,
//     volume: 0,
//     onChainOnly: false,
//     default: true,
//   };
//   const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
//   const { data, count } = await supabase
//     .from("assets")
//     .select(
//       "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap,price,liquidity,rank,rank_change_24h,contracts,blockchains,twitter,website,chat,created_at",
//       { count: "exact" }
//     )
//     .gte("liquidity", settings.liquidity)
//     .gte("global_volume", settings.volume)
//     .gte("market_cap", 0)
//     .order("views_change_24h", { ascending: false })
//     .limit(100);
//   return {
//     tokens: data || [],
//     count: count || 0,
//     cookies: cookieStore ?? "",
//     isMobile,
//   };
// }

export default function trendings() {
  // const data = await fetchTrendingsAssets();
  return (
    <>
      {/* <Head>
        <title>
          Trending cryptocurrencies, fast growing and hidden gems on Mobula
        </title>
        <meta
          name="description"
          content="Discover hidden gems gaining traction on Mobula, their real time price, liquidity and rank."
        />
        <meta
          property="og:image"
          content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
        />
        <meta
          name="twitter:image"
          content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
        />
        <meta
          itemProp="image"
          content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
        />
        <meta name="url" content="https://mobula.fi/trending" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head> */}
      <Trendings tokensBuffer={[]} count={0} isMobile={false} />
    </>
  );
}
