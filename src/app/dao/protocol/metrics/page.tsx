import { Metadata } from "next";
import React from "react";
import { Metrics } from "../../../../features/dao/protocol/components/metrics";
import { createSupabaseDOClient } from "../../../../lib/supabase";

export interface NotifHistoryType {
  content: string;
  image: string;
  red: boolean;
  title: string;
}

export interface UsersType {
  address: string;
  adventure: {
    Genesis: boolean[];
    Introduction: boolean[];
  };
  balance: number;
  bot: boolean;
  claim_history: {
    date: number;
    amount: number;
  };
  claimed: number;
  code: number | null;
  connections_history: string[];
  created_at: Date | string;
  discord: string;
  external_wallets: string[];
  first_streak: Date | string;
  id: number;
  ip: string | null;
  last_claim: Date | string;
  last_connection: Date | string;
  last_mobl: Date | string;
  last_notification: Date | string;
  last_notification_name: string | null;
  nft: string | null;
  nft_id: number | null;
  notifications_history: NotifHistoryType[];
  notifications_settings: { [key: string]: any };
  owed: number;
  pending_claim: boolean;
  profile_pic: string;
  publications: number;
  referred: { ip: string; address: string }[];
  refferer: string | any | null;
  reflink: string;
  stacked_mobl: number;
  streaks: number;
  swapped: boolean;
  tags: string[];
  tasks_done: number[];
  telegram: string | null;
  telegram_id: number | null;
  timezone_offset: number;
  twitter: string | null;
  unverified_telegram: string | null;
  username: string | null;
  visits: number;
  voting_power: number;
  watchlist: number[];
}

export interface MemberType {
  address: string;
  bad_decisions: number;
  created_at: Date | string;
  discord_id: number | string | null;
  good_decisions: number;
  id: number;
  username: string;
  users: UsersType;
}

async function fetchProtocolMetrics() {
  const supabase = createSupabaseDOClient();
  const { data: total_proposals } = await supabase
    .from("history_dao")
    .select("id", { count: "exact" })
    .match({ validated: true });

  const { data: total_mobulers } = await supabase
    .from("members")
    .select("*, users(*)")
    .order("good_decisions", { ascending: false });

  const { data: dao_members } = await supabase
    .from("members")
    .select("*, users(*)")
    .order("good_decisions", { ascending: false });
  if (total_mobulers && dao_members && total_proposals) {
    return {
      total_mobulers,
      dao_members,
      total_proposals,
    };
  }
  return {
    total_mobulers: null,
    dao_members: null,
    total_proposals: null,
  };
}

export const metadata: Metadata = {
  title: "Protocol DAO Metrics | Mobula",
  description:
    "Explore the DAO Metrics page on Mobula, a detailed analytics platform showcasing recent token listings, their acceptance or rejection status by DAO members, and comprehensive statistical data.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula dao, protocol dao, protocol dao metrics, protocol dao overview, metrics, protocol dao, dao, mobula dao",
};

export default async function metricsProtocol() {
  const data = await fetchProtocolMetrics();
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
      <meta name="url" content="https://mobula.fi/dao/protocol/metrics" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <Metrics
        total_mobulers={data?.total_mobulers || []}
        dao_members={data?.dao_members || []}
        total_proposals={data?.total_proposals || []}
      />
    </>
  );
}
