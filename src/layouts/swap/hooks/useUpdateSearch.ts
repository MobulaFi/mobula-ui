import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useState } from "react";
import { isAddress } from "viem";
import { useNetwork } from "wagmi";
import { SwapContext } from "..";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { SearchTokenProps } from "../popup/select/model";
import { fetchContract } from "../utils";

export const useUpdateSearch = (position: string) => {
  const { holdings } = useContext(SwapContext);
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchTokenProps[]>([]);

  const currentChain = chain?.id || 1;
  const chainData = blockchainsIdContent[String(currentChain)];
  const realHoldings = holdings?.holdings.multichain.filter(
    (entry) => (entry?.price || 0) > 0 && entry.balance > 0
  );

  const updateSearch = async (search: string, fullOnChain = true) => {
    if (!chainData) return;
    const supabase = createSupabaseDOClient();
    if (isAddress(search)) {
      const fetchResults = await Promise.all(fetchContract(search));

      const { data } = fetchResults[fetchResults.length - 1];
      const { symbol, blockchain } =
        fetchResults.filter((entry) => entry)[0] || {};

      if (symbol && blockchain) {
        setResults([
          {
            symbol,
            logo: data?.[0]?.logo || "/empty/unknown.png",
            address: search,
            blockchain,
            contracts: data?.[0]?.contracts || [search],
            blockchains: data?.[0]?.blockchains || [blockchain],
            switch: blockchain !== chainData.name,
            price_change_24h: data?.[0]?.price_change_24h || 0,
          },
        ]);
        setIsLoading(false);
      }
    } else {
      const query = supabase
        .from("assets")
        .select(
          "name,rank,symbol,logo,market_cap,contracts,blockchains,price,price_change_24h,price,id"
        )
        .or(
          `name.ilike.${search}%,symbol.ilike.${search}%,name.ilike.${search}`
        )
        .order("market_cap", { ascending: false });

      if (fullOnChain) query.not("contracts", "eq", "{}");

      if (!search)
        query.or(
          "volume.gte.100000,liquidity_market_cap_ratio.gte.0.01,coin.eq.true"
        );

      const { data: names } = await query.limit(7);
      if (names && names.length > 0) {
        setResults(
          (search || !fullOnChain
            ? [...names]
            : [
                ...(realHoldings && position === "in"
                  ? realHoldings
                  : [...names]),
              ]
          ).map((name) => {
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
              blockchainsContent[name.blockchains[0]].eth?.symbol ===
              name.symbol;

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
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    updateSearch("");
  }, [holdings]);

  return { results, updateSearch, isLoading };
};
