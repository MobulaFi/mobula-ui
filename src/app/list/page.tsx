import { Metadata } from "next";
import React from "react";
import { Listing } from "../../features/misc/listing-form";
import { ListingProvider } from "../../features/misc/listing-form/context-manager";

export const metadata: Metadata = {
  title: "Request a crypto asset listing | Mobula",
  description:
    "List a cryptocurrency in the Mobula ecosystem. Make your crypto-currency project available to millions on the first decentralized data aggregator.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula listing, crypto listing, crypto listing request, crypto listing form",
};

export default function List() {
  return (
    <ListingProvider>
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
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <Listing />
    </ListingProvider>
  );
}
