import { Metadata } from "next";
import React from "react";
import { NewPairs } from "../../features/data/new-pairs";

async function fetchNewPairs() {
  const fetchNewPairs = fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/query/token?sortBy=listed_at&sortOrder=desc`
  );

  console.log(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/query/token?sortBy=listed_at&sortOrder=desc`
  );

  const [newPairs] = await Promise.all([fetchNewPairs]).then((r) => {
    return Promise.all(r.map((res) => res.json()));
  });

  return {
    pairs: newPairs.data,
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

export default async function NewPairsPage() {
  const data = await fetchNewPairs();
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
      <NewPairs pairs={data.pairs} />
    </>
  );
}
