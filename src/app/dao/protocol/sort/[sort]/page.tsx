import React from "react";
import { Sort } from "../../../../../features/dao/protocol/components/sorts";
import GeneralLayout from "../../layout";

function Dataprovider() {
  //   const searchQuery = searchParams();
  //   const sort = searchQuery.get("sort");
  //   const token = fromUrlToName(sort);
  return (
    <>
      {/* <Head>
        <title>{name} First Sort | Mobula</title>
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
      <meta name="robots" content="index, follow" /> */}
      <GeneralLayout isFirstSort>
        <Sort />
      </GeneralLayout>
    </>
  );
}

export default Dataprovider;
