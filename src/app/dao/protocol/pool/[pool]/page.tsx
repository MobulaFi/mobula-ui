import React from "react";
import { PendingPool } from "../../../../../features/dao/protocol/components/pending-pool";
import GeneralLayout from "../../layout";

function Dataprovider({ searchParams }) {
  //   const searchQuery = searchParams();
  //   const pool = searchQuery.get("pool");
  //   const token = fromUrlToName(pool);
  return (
    <>
      {/* <Head>
        <title>{token} pool | Mobula</title>
      </Head>
      <meta
        name="description"
        content="Discover the assets recently added on Mobula, their real time price, chart, liquidity, and more."
      />
      <meta
        name="image"
        content="https://mobula.fi/metaimage/DAO/protocol.png"
      /> 
      <meta name="url" content="https://mobula.fi/dao/protocol/sort" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" />*/}
      <GeneralLayout isPendingPool>
        <PendingPool />
      </GeneralLayout>
    </>
  );
}

export default Dataprovider;
