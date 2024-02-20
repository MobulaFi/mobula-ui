import { Metadata } from "next";
import React from "react";
import { Chains } from "../../../features/data/chains";
import { ChainsProvider } from "../../../features/data/chains/context-manager";
import { fromUrlToName } from "../../../utils/formaters";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function getChains({ params }) {
  const blockchain = fromUrlToName(params?.chain);
  const fetchChain = fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/stats?blockchain=${blockchain}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
      },
    }
  );
  const fetchPairs = fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/pairs?blockchain=${blockchain}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
      },
    }
  );

  const [chain, pairs] = await Promise.all([fetchChain, fetchPairs]).then(
    (r) => {
      return Promise.all(r.map((res) => res.json()));
    }
  );

  return {
    blockchain: chain.data,
    pairs: pairs.data,
  };
}

type Props = {
  params: { chain: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain } = params;
  const formatName =
    fromUrlToName(chain)?.slice(0, 1)?.toUpperCase() +
    fromUrlToName(chain)?.slice(1);
  return {
    title: `${formatName} DeFi Dashboard | Track DEX pairs - Mobula`,
    description: `${formatName} DEX pairs real time dashboard, price updates, trending low cap tokens & DeFi stats.`,
  };
}

async function ChainPage({ params }: Props) {
  const { blockchain, pairs } = await getChains({ params });
  const { chain } = params;

  const formatName =
    fromUrlToName(chain)?.slice(0, 1)?.toUpperCase() +
    fromUrlToName(chain)?.slice(1);
  const title = `${formatName} DeFi Dashboard | Track DEX pairs - Mobula`;
  const description = `${formatName} DEX pairs real time dashboard, price updates, trending low cap tokens & DeFi stats.`;
  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
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
      </head>

      <ChainsProvider chain={blockchain} pairs={pairs}>
        <Chains />
      </ChainsProvider>
    </>
  );
}

export default ChainPage;
