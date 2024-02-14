import React from "react";
import { BaseAssetProvider } from "../../../features/asset/context-manager";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ params }) {
  const { pair } = params;

  try {
    const fetchPair = fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/pair?address=${pair}&stats=metadata`,
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

    const pairData = activePair?.data;

    return {
      data: pairData,
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
  const { data }: any = await fetchAssetData({ params });
  const newPair = {
    ...data,
    isPair: true,
    address: pair,
  };
  const baseToken = newPair?.[newPair?.baseToken];
  const vsToken = newPair?.[newPair?.quoteToken];
  let title = "Pair loading - Mobula";
  if (baseToken)
    title = `${baseToken?.symbol} - ${baseToken?.name} / ${vsToken?.symbol} on ${newPair?.blockchain} - Mobula`;
  let description = "Realtime price charts, trading history and info";
  if (baseToken)
    description = `${baseToken?.name} (${baseToken?.symbol}) realtime price charts, trading history and info`;
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
      <BaseAssetProvider
        token={newPair}
        tradHistory={data || []}
        launchpad={data?.launchpads}
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
    </>
  );
}

export default AssetPage;
