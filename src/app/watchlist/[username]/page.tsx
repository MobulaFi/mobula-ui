import { headers } from "next/headers";
import React from "react";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { SeeWatchlist } from "../../../features/user/watchlist/components/see-watchlist";

export default function WatchlistUserNamePage() {
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  return (
    <>
      {/* <Head>
        <title>Portfolio | Mobula</title>
      </Head>
      <meta
        name="description"
        content="Follow the evolution of the crypto-assets (token, coin, nfts) of your choice. Be alerted in case of evolutions. Be ahead of the market with on-chain data."
      />
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
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" /> */}
      <NavActiveProvider>
        <SeeWatchlist
          watchlist={undefined}
          tokens={undefined}
          userOfWatchlist={undefined}
          isMobile={isMobile}
        />
      </NavActiveProvider>{" "}
    </>
  );
}
