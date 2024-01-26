import { BaseAssetProvider } from "features/asset/context-manager";
import React from "react";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

const apiKey = process.env.NEXT_PUBLIC_PRICE_KEY || "";

async function fetchAssetData({ params }) {
  const { pair } = params;
  try {
    if (!pair) return;
    console.log(
      "hjddhhdhdhd",
      `https://api.mobula.io/api/1/market/pair?address=${pair}&stats=true`
    );
    const fetchPair = fetch(
      `https://api.mobula.io/api/1/market/pair?address=${pair}&stats=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    const [activePair] = await Promise.all([fetchPair]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });

    console.log("HHHHHHHHHH", activePair);

    const { data: activePairData } = activePair;

    const fetchPairTrade = await fetch(
      `https://api.mobula.io/api/1/market/trades/pair?asset=${activePairData?.token0?.address}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    ).then((res) => res.json());

    console.log("activePair", fetchPairTrade);

    return {
      data: activePairData,
      trade: fetchPairTrade,
    };
  } catch (error) {
    console.log(error);
  }
}

type Props = {
  params: { asset: string };
};

async function AssetPage({ params }) {
  const { pair } = params;
  const test: any = await fetchAssetData({ params });
  const pairInfo = {
    liquidity: 1_000_000_000,
    market_cap: 1_000_000_000,
    circ_supply: 1_000_000_000,
    change_1h: 12,
    change_24h: 1.23,
    change_7d: 20.23,
    change_30d: 12.23,
    ath: [1606015467481, 1243],
    atl: [1506015467481, 0.3],
  };

  console.log("YOOOOOOOOOOOO", test);
  const newPair = {
    ...pairInfo,
    token0: {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      name: "Ethereum",
      price: 2200.002725868934,
      priceToken: 1401.6847038549076,
      priceTokenString: "1401.68470385490763874258846044540405",
      symbol: "ETH",
      logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
    },
    token1: {
      address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      name: "Arbitrum",
      price: 1.5728874693341508,
      priceToken: 0.0007134272045987261,
      priceTokenString: "0.00071342720459872607536438993137",
      symbol: "ARB",
      logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
    },
    quoteToken: "token0",
    baseToken: "token1",
    blockchain: "Ethereum",
    volume: 1_000_000_000,
    buyVolume: 100_000_000,
    sellVolume: 100_000_000,
    buys: 32_343,
    sells: 32_343,
    txns: 20_234,
    isPair: true,
    address: pair,
  };

  return (
    <>
      <head>
        <title>Test asset pair</title>
        <meta
          name="description"
          content={`Dive into the real-time price, detailed chart analysis, and liquidity data of ${test?.asset?.name} on Mobula. Gain insights into its current market dynamics and trends, all in one place for informed trading and investment decisions.`}
        />
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
      <div className="h-screen w-screen text-white dark:text-white">
        <BaseAssetProvider
          token={newPair}
          tradHistory={test || []}
          launchpad={test?.launchpads}
          hideTxCookie={"{ hideTx: false }"}
          tradeCookie={undefined}
          isAsset={false}
          tradePairs={[]}
        >
          <ShowMoreProvider>
            <NavActiveProvider>
              <Assets isAssetPage={false} />
            </NavActiveProvider>
          </ShowMoreProvider>
        </BaseAssetProvider>
        <pre>
          {JSON.stringify(
            {
              test,
            },
            null,
            2
          )}
        </pre>
        <pre>
          {JSON.stringify(
            {
              trade: test?.data,
            },
            null,
            2
          )}
        </pre>
      </div>
    </>
  );
}

export default AssetPage;
