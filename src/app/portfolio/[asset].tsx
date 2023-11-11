import { NextPage } from "next";
import { useContext, useEffect } from "react";
import { Portfolio } from "../../components/Pages/User/Portfolio";
import { PortfolioV2Context } from "../../components/Pages/User/Portfolio/context-manager";

interface AssetPortfolioProps {
  asset: string; // Replace this with your portfolio type
}

const AssetPortfolioPage: NextPage<AssetPortfolioProps> = ({ asset }) => {
  const { setIsAssetPage } = useContext(PortfolioV2Context);
  useEffect(() => {
    setIsAssetPage(true);
  }, []);
  return (
    <>
      {/* <Head>
        <title>Analyze Performance of Your Crypto Asset | Mobula.fi</title>
        <meta
          name="description"
          content="Analyze the performance of your specific crypto asset in detail. Track price movements, historical data, and evaluate the impact on your overall portfolio. Make informed decisions based on accurate insights."
        />{" "}
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
      </Head> */}
      <Portfolio main={false} asset={asset} />
    </>
  );
};
export default AssetPortfolioPage;

export async function getServerSideProps({ req, params }) {
  const userAgent = req.headers["user-agent"];
  const isMobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Tablet/i
    )
  );
  return {
    props: {
      asset: params?.asset,
      cookies: req.headers.cookie ?? "",
      isMobile,
    },
  };
}
