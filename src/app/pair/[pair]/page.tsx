import { BaseAssetProvider } from "features/asset/context-manager";
import React from "react";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ params }) {
  const { pair } = params;
  try {
    if (!pair) return;
    const fetchPair = fetch(
      `https://api.mobula.io/api/1/market/pair?address=${pair}`
    );

    const [activePair] = await Promise.all([fetchPair]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });

    const { data: activePairData } = activePair;

    const fetchPairTrade = await fetch(
      `https://api.mobula.io/api/1/market/trades?asset=${activePairData?.token0?.address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "mobula-api-key",
        },
      }
    ).then((res) => res.json());

    try {
      const fetchPairHistory = await fetch(
        `https://api.mobula.io/api/1/market/history/pair?address=${pair}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "mobula-api-key",
          },
        }
      ).then((res) => res.json());

      console.log("activePair", fetchPairTrade);

      return {
        data: activePairData,
        trade: fetchPairTrade,
        history: fetchPairHistory,
      };
    } catch (error) {
      console.log(error);
    }
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
  const { data, trade, history }: any = await fetchAssetData({ params });
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

  console.log("token0", trade);
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
          content={`Dive into the real-time price, detailed chart analysis, and liquidity data of ${data?.asset?.name} on Mobula. Gain insights into its current market dynamics and trends, all in one place for informed trading and investment decisions.`}
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
          tradHistory={trade || []}
          launchpad={data?.launchpads}
          hideTxCookie={"{ hideTx: false }"}
          tradeCookie={undefined}
          isAsset={false}
          tradePairs={trade.data || []}
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
              data,
            },
            null,
            2
          )}
        </pre>
        <pre>
          {JSON.stringify(
            {
              trade: trade?.data,
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
