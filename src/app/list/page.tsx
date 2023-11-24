import React from "react";
import { Listing } from "../../features/misc/listing-form";
import { ListingProvider } from "../../features/misc/listing-form/context-manager";

export default function List() {
  return (
    <ListingProvider>
      {/* <Head>
        <title>Request a crypto asset listing - Mobula</title>
      </Head>
      <meta
        name="description"
        content="List a cryptocurrency in the Mobula ecosystem. Make your crypto-currency project available to millions on the first decentralized data aggregator."
      />
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Ecosystem/Listing.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Ecosystem/Listing.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Ecosystem/Listing.png"
      />
      <meta name="url" content="https://mobula.fi/list" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" /> */}
      <Listing />
    </ListingProvider>
  );
}
