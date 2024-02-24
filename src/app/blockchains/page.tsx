import { Blockchains } from "../../features/data/blockchains";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

type Props = {
  params: { chain: string };
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { chain } = params;
//   const formatName =
//     fromUrlToName(chain)?.slice(0, 1)?.toUpperCase() +
//     fromUrlToName(chain)?.slice(1);
//   return {
//     title: `${formatName} DeFi Dashboard | Track DEX pairs - Mobula`,
//     description: `${formatName} DEX pairs real time dashboard, price updates, trending low cap tokens & DeFi stats.`,
//   };
// }

async function BlockchainsPage({ params }: Props) {
  //   const title = `${formatName} DeFi Dashboard | Track DEX pairs - Mobula`;
  //   const description = `${formatName} DEX pairs real time dashboard, price updates, trending low cap tokens & DeFi stats.`;
  return (
    <>
      <head>
        {/* <title>{title}</title> */}
        {/* <meta name="description" content={description} /> */}
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
      <Blockchains />
    </>
  );
}

export default BlockchainsPage;
