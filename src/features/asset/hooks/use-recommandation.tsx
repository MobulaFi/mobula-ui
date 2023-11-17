import { useEffect, useState } from "react";
import { createSupabaseDOClient } from "../../../lib/supabase";

export const useRecommandation = (id: number) => {
  const [boxAsset, setBoxAsset] = useState({
    name: "??",
    price: "??",
    logo: "/unknown.png",
    price_change_24h: 0,
    id,
  });

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("id,name,price,logo,price_change_24h")
      .match({ processed: true })
      .range(id - 1, id)
      .then((r) => {
        if (r.data && r.data[0]) setBoxAsset(r.data[0]);
      });
  }, []);
  return boxAsset;
};
