import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";
import { Portfolio } from "../../../features/user/portfolio";

interface PortfolioProps {
  params: Params;
}

export async function generateMetadata({
  params,
}: PortfolioProps): Promise<Metadata> {
  const { address } = params;
  return {
    title: `Explore ${address} Portfolio on Mobula | Mobula`,
    keywords:
      "Mobula, Mobula portfolio, portfolio tracker, crypto portfolio tracker",
    description: `Uncover the composition and value of any cryptocurrency wallet with Mobula's Portfolio Tracker. Enter any wallet address to access a detailed view of its holdings, including asset distribution, current market values, and historical performance. A powerful tool for market analysis and insight into diverse investment strategies.`,
  };
}

const PortfolioExplorerPage = ({ params }: PortfolioProps) => {
  const address = params.address;
  return (
    <>
      <head>
        <title>{`Explore ${address} Portfolio on Mobula | Mobula`}</title>
        <meta
          name="keywords"
          content="Mobula, Mobula portfolio, portfolio tracker, crypto portfolio tracker"
        />
        <meta
          name="description"
          content={`Uncover the composition and value of any cryptocurrency wallet with Mobula's Portfolio Tracker. Enter any wallet address to access a detailed view of its holdings, including asset distribution, current market values, and historical performance. A powerful tool for market analysis and insight into diverse investment strategies.`}
        />
      </head>
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
      <Portfolio address={address} isWalletExplorer />
    </>
  );
};

export default PortfolioExplorerPage;
