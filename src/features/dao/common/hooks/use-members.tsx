import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseDOClient } from "../../../../lib/supabase";

export const useMember = () => {
  const pathname = usePathname();
  const supabase = createSupabaseDOClient();
  const [membersQuantity, setMembersQuantity] = useState<any>();

  useEffect(() => {
    if (pathname.includes("governance")) {
      supabase
        .from("users")
        .select("id", { count: "exact" })
        .gt("stacked_mobl", 0)
        .then((r) => {
          setMembersQuantity(r.count);
        });
    } else {
      supabase
        .from("members")
        .select("id", { count: "exact" })
        .then((r) => {
          setMembersQuantity(r.count);
        });
    }
  }, []);

  return membersQuantity;
};
