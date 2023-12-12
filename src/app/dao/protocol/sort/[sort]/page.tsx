import { Metadata } from "next";
import React from "react";
import { Sort } from "../../../../../features/dao/protocol/components/sorts";
import GeneralLayout from "../../layout";

export const metadata: Metadata = {
  title: "Protocol DAO First Sort | Mobula",
  description:
    "Initial review for asset listing on Mobula: key criteria and community insights guiding our early selection process. A vital snapshot for understanding our governance fundamentals.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula dao, protocol dao, protocol dao first review, protocol dao review",
};

function Dataprovider() {
  //   const searchQuery = searchParams();
  //   const sort = searchQuery.get("sort");
  //   const token = fromUrlToName(sort);
  return (
    <>
      <meta
        name="image"
        content="https://mobula.fi/metaimage/DAO/protocol.png"
      />
      <meta name="url" content="https://mobula.fi/dao/protocol/sort" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" />
      <GeneralLayout isFirstSort>
        <Sort />
      </GeneralLayout>
    </>
  );
}

export default Dataprovider;
