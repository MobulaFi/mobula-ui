import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { SwapContext } from "..";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { SearchTokenProps } from "../popup/select/model";

export const useSwapAssets = (position: string) => {
  const { holdings } = useContext(SwapContext);
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchTokenProps[]>([]);

  const currentChain = chain?.id || 1;
  const chainData = blockchainsIdContent[String(currentChain)];
  const realHoldings = holdings?.holdings.multichain.filter(
    (entry) => (entry?.price || 0) > 0 && entry.balance > 0
  );

  const fetchAssets = async (fullOnChain = true) => {
    if (!chainData || results?.length > 0) return;
    const supabase = createSupabaseDOClient();

    const query = supabase
      .from("assets")
      .select(
        "name,rank,symbol,logo,market_cap,contracts,blockchains,price,price_change_24h,price,id"
      )
      .order("market_cap", { ascending: false })
      .cs("blockchains", [chain?.name]);

    if (fullOnChain) query.not("contracts", "eq", "{}");

    query.or(
      "volume.gte.100000,liquidity_market_cap_ratio.gte.0.01,coin.eq.true"
    );

    const { data: names } = await query.limit(6);
    if (names && names.length > 0) {
      setResults(
        names.map((name) => {
          if (!fullOnChain) return name;

          const address =
            name.contracts[
              name.blockchains.indexOf(
                name.blockchains.find(
                  (blockchain: string) => blockchain === chainData.name
                )
              )
            ];

          const coin =
            blockchainsContent[name.blockchains[0]].eth?.symbol === name.symbol;

          if (coin) {
            return {
              ...name,
              coin,
              blockchain: name.blockchains[0],
              price: name.price,
              switch:
                blockchainsContent[name.blockchains[0]].evmChainId !==
                currentChain,
            };
          }

          if (address) {
            return {
              ...name,
              address,
              blockchain: blockchainsIdContent[String(currentChain)]?.name,
              price: name.price,
            };
          }
          return {
            ...name,
            address: name.contracts[0],
            blockchain: name.blockchains[0],
            switch: true,
          };
        })
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [holdings]);

  return { fetchAssets, results };
};
