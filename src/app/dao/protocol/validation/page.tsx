import { Metadata } from "next";
import React from "react";
import { Sort } from "../../../../features/dao/protocol/components/sorts";
import GeneralLayout from "../layout";

export const metadata: Metadata = {
  title: "Protocol DAO Final Review | Mobula",
  description:
    "Explore the decisive review of listing a new asset on Mobula. This final analysis covers key metrics, community consensus, and strategic considerations shaping the verdict. ",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula dao, protocol dao, protocol dao final review, protocol dao review",
};

export default function ValidationPage() {
  return (
    <>
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
      <meta name="url" content="https://mobula.fi/dao/protocol/validation" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <GeneralLayout>
        <Sort />
      </GeneralLayout>
    </>
  );
}
