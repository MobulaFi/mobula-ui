import React from "react";
import { Overview } from "../../../../features/dao/protocol/components/overview";
import { createSupabaseDOClient } from "../../../../lib/supabase";
import Layout from "../../layout";

async function fetchOverviewData() {
  const supabase = createSupabaseDOClient();
  const q1 = supabase
    .from("history_dao")
    .select("*")
    .order("created_at", { ascending: false })
    .match({ protocol_version: 3 })
    .limit(30);

  const q2 = supabase
    .from("members")
    .select("*, users(*)")
    .order("good_decisions", { ascending: false })
    .match({ protocol_version: 3 })
    .limit(30);

  const q3 = supabase
    .from("history_dao")
    .select("*")
    .order("created_at", { ascending: false })
    .filter("validated", "eq", "true")
    .match({ protocol_version: 3 })
    .limit(20);

  const q4 = supabase
    .from("history_dao")
    .select("*")
    .order("created_at", { ascending: false })
    .filter("validated", "eq", "false")
    .match({ protocol_version: 3 })
    .limit(10);

  const [
    { data: recentlyAdded },
    { data: daoMembers },
    { data: validated },
    { data: rejected },
  ] = await Promise.all([q1, q2, q3, q4]);

  return {
    recentlyAdded,
    daoMembers,
    validated,
    rejected,
  };
}

export default async function OverviewPage() {
  const data = await fetchOverviewData();
  return (
    <Layout
      params={{
        recentlyAdded: data?.recentlyAdded,
        daoMembers: data?.daoMembers,
        validated: data?.validated,
        rejected: data?.rejected,
      }}
    >
      <Overview />
    </Layout>
  );
}

{
  /* <Head>
        <title>Governance DAO Proposals | Mobula</title>
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
      <meta name="url" content="https://mobula.fi/dao/protocol/overview" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" /> */
}
{
  /* </OverviewContext.Provider> */
}
