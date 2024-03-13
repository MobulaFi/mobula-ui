import React from "react";
import { Analytic } from "../../features/analytic";

export default function AnalyticPage() {
  return (
    <>
      <head>
        <title>Mobula Analytic</title>

        <meta
          name="description"
          content="Get metadata for +30,000 cryptocurrencies, such a Ethereum official Twitter account and website, from a public REST API or direclty on-chain via smart-contract queries."
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
        <meta
          name="url"
          content="https://developer.mobula.fi/reference/getting-started"
        />
        <meta name="keywords" content="Mobula" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
      </head>
      <Analytic />
    </>
  );
}
