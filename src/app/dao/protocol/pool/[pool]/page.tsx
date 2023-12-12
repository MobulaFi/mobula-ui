import { Metadata } from "next";
import React from "react";
import { PendingPool } from "../../../../../features/dao/protocol/components/pending-pool";
import GeneralLayout from "../../layout";

export const metadata: Metadata = {
  title: "Protocol DAO Pending Pools | Mobula",
  description:
    "Explore Mobula's Protocol DAO Pending Pools, where community-driven assets await listing. Delve into a unique ecosystem where user donations play a pivotal role in bringing new assets to our platform. An engaging space for those who influence and fund the future of asset inclusion",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula dao, protocol dao, protocol dao first review, protocol dao review, pending pools, protocol dao pending pools, protocol dao pending pools",
};

function Dataprovider() {
  //   const searchQuery = searchParams();
  //   const pool = searchQuery.get("pool");
  //   const token = fromUrlToName(pool);
  return (
    <>
      <meta
        name="image"
        content="https://mobula.fi/metaimage/DAO/protocol.png"
      />
      <meta name="url" content="https://mobula.fi/dao/protocol/sort" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <GeneralLayout isPendingPool>
        <PendingPool />
      </GeneralLayout>
    </>
  );
}

export default Dataprovider;
