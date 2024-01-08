import { Metadata } from "next";
import { Portfolio } from "../../../features/user/portfolio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Analyze Your Crypto Portfolio - On-Chain & Off-Chain | Mobula",
  description:
    "Track multiple wallets on multiple chains, add CeFi transactions, NFTs, calculate PNL, ROI, historical balances, and more.",
  keywords:
    "Mobula, Mobula portfolio, portfolio tracker, crypto portfolio tracker",
};

export default function ManagePortfolioPage() {
  return (
    <>
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
      <Portfolio isManage />
    </>
  );
}
