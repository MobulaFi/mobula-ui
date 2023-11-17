import { Portfolio } from "features/user/portfolio";

const PortfolioExplorerPage = ({ params }) => {
  const address = params.address;
  return (
    <>
      {/* <Head>
        <title>{address} Portfolio | Mobula</title>
      </Head> */}
      <Portfolio address={address} main isWalletExplorer />
    </>
  );
};

export default PortfolioExplorerPage;
