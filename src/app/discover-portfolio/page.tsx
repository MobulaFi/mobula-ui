import Head from "next/head";
import React from "react";
import { PortfolioLanding } from "../../features/landings/portfolio";

export default function DiscoverPortfolioPage() {
  return (
    <>
      <Head>
        <title>
          Mobula API - Wallet balance, transactions, historical net worth of any
          crypto wallet
        </title>
        <meta
          name="description"
          content="Get data about any crypto wallet on +10 blockchains, including wallet balances, transactions, historical net worth for any crypto asset or general USD net worth."
        />
        {/* TODO:metaname */}
        <meta
          property="og:image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta
          name="twitter:image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta
          itemProp="image"
          content="https://mobula.fi/metaimage/Generic/others.png"
        />
        <meta name="url" content="https://mobula.fi/explorer-api" />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </Head>
      <PortfolioLanding />
    </>
  );
}
