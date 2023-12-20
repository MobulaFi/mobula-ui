import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createSupabaseDOClient } from "../../../../lib/supabase";
import { OverviewContext } from "../context-manager/overview";
import { Member } from "../models";

export const useNonValueToken = () => {
  const {
    bufferValidated,
    bufferRejected,
    bufferRecentlyAdded,
    bufferDaoMembers,
    setGoodDecisions,
    setBadDecisions,
  } = useContext(OverviewContext);
  const { address } = useAccount();
  const [validated, setValidated] = useState(bufferValidated || []);
  const [daoMembers, setDaoMembers] = useState(bufferDaoMembers || []);
  const [rejected, setRejected] = useState(bufferRejected || []);
  const [recentlyAdded, setRecentlyAdded] = useState(bufferRecentlyAdded || []);
  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("history_dao")
      .select("*")
      .match({ protocol_version: 3 })
      .order("created_at", { ascending: false })

      .then((r) => {
        setRecentlyAdded(r.data);
      });
    supabase
      .from("history_dao")
      .select("*")
      .order("created_at", { ascending: false })
      .filter("validated", "eq", "true")
      .match({ protocol_version: 3 })
      .limit(10)
      .then((r) => {
        setValidated(r.data);
      });

    supabase
      .from("history_dao")
      .select("*")
      .order("created_at", { ascending: false })
      .filter("validated", "eq", "false")
      .match({ protocol_version: 3 })
      .limit(10)
      .then((r) => {
        setRejected(r.data);
      });
  }, []);

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from<Member>("members")
      .select("*")
      .eq("address", address)
      .single()
      .then((r) => {
        if (r.data) {
          setGoodDecisions(r.data.good_decisions);
          setBadDecisions(r.data.bad_decisions);
        }
      });
  }, [address]);

  return { recentlyAdded, rejected, validated, daoMembers };
};
