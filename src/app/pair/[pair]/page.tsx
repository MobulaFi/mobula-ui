import { BaseAssetProvider } from "features/asset/context-manager";
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
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/pair?address=${pair}&stats=true`
    );
    const fetchPair = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/pair?address=${pair}&stats=true`,
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
    const pairData = activePair?.data;

    const fetchPairTrade = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/trades/pair?asset=${
        activePair?.[activePair?.baseToken]?.address
      }&blockchain=${activePair?.blockchain}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    console.log("activePair?.[activePair?.baseToken]?.name", activePair);

    const fetchSocialLink = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/metadata?asset=${
        pairData?.[pairData?.baseToken]?.name
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    const [pairTrade, pairSocial] = await Promise.all([
      fetchPairTrade,
      fetchSocialLink,
    ]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });

    console.log("activePair", pairSocial);

    return {
      data: pairData,
      trade: pairTrade,
      social: pairSocial,
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
  const { data, social }: any = await fetchAssetData({ params });

  console.log("YOOOOOOOOOOOO", social);
  const newPair = {
    ...data,
    social: social?.data,
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
