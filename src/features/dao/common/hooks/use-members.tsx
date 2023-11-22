import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {createSupabaseDOClient} from "../../../../../utils/supabase";

export const useMember = () => {
  const router = useRouter();
  const supabase = createSupabaseDOClient();
  const [membersQuantity, setMembersQuantity] = useState<any>();

  useEffect(() => {
    if (router.pathname.includes("governance")) {
      supabase
        .from("users")
        .select("id", {count: "exact"})
        .gt("stacked_mobl", 0)
        .then(r => {
          setMembersQuantity(r.count);
        });
    } else {
      supabase
        .from("members")
        .select("id", {count: "exact"})
        .then(r => {
          setMembersQuantity(r.count);
        });
    }
  }, []);

  return membersQuantity;
};
