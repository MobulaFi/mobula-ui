import { useEffect, useState } from "react";
import { createSupabaseDOClient } from "../../../../lib/supabase";

export const useAmountMobulers = (isGovernance: boolean) => {
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    const supabase = createSupabaseDOClient();
    if (isGovernance) {
      supabase
        .from("users")
        .select("id", { count: "exact" })
        .gt("voting_power", 0)
        .then((r) => {
          if (r.count) setAmount(r.count);
        });
    }
  }, []);
  return amount;
};
