import React from "react";
import { Sort } from "../../../../features/dao/protocol/components/sorts";
import GeneralLayout from "../layout";

export default function SortPage() {
  return (
    <>
      {/* <Head>
        <title>Protocol DAO First Sort | Mobula</title>
      </Head>
      <meta
        name="description"
        content="Discover the assets recently added on Mobula, their real time price, chart, liquidity, and more."
      />
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/DAO/protocol.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/DAO/protocol.png"
      />
      <meta
        itemProp="image"
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
