import { useContext, useEffect, useState } from "react";
import { TransactionReceipt } from "viem";
// import {
//   blacklistedName,
//   blacklistedNft,
//   blacklistedUri,
// } from "../../Pages/User/Portfolio/components/category/nfts";
// import { PortfolioV2Context } from "../../Pages/User/Portfolio/context-manager";
import { useParams } from "next/navigation";
import { getIPFSUrl } from "../constants";
import { PortfolioV2Context } from "../features/user/portfolio/context-manager";
import {
  HoldingNFT,
  HoldingsNftResponse,
  HoldingsResponse,
} from "../interfaces/holdings";
import { GET } from "../utils/fetch";

export const useHoldings = (address?: string) => {
  const [holdings, setHoldings] = useState<HoldingsResponse | null>(null);
  useEffect(() => {
    if (address) {
      GET("/holdings", {
        account: address,
      })
        .then((r) => r.json())
        .then((r: HoldingsResponse) => {
          setHoldings(r);
        });
    }
  }, [address]);

  return holdings;
};

export const useHoldingsTrading = (
  address: string | undefined,
  completedTx: (TransactionReceipt & { timestamp: number }) | undefined
) => {
  const [holdings, setHoldings] = useState<HoldingsResponse | null>(null);
  useEffect(() => {
    if (address) {
      GET("/holdings", {
        account: address,
      })
        .then((r) => r.json())
        .then((r: HoldingsResponse) => {
          setHoldings(r);
        });
    }
  }, [address]);

  useEffect(() => {
    if (completedTx) {
      GET("/holdings", {
        account: address,
        force: true,
      })
        .then((r) => r.json())
        .then((r: HoldingsResponse) => {
          setHoldings(r);
        });
    }
  }, [completedTx]);

  return holdings;
};

export const useNftHoldings = (address?: string) => {
  const [nfts, setNfts] = useState<HoldingNFT[]>();
  useEffect(() => {
    if (address) {
      GET(
        "/api/1/wallet/nfts",
        {
          wallet: address,
        },
        false,
        {
          headers: {
            Authorization: "93ebcd82-7cea-48f2-9cd4-7ba999e15eb6",
          },
        }
      )
        .then((resp) => resp.json())
        .then((resp: HoldingsNftResponse) => {
          setNfts(
            resp.data
              .map((entry) => {
                try {
                  const url =
                    entry.metadata && JSON.parse(entry.metadata)?.image
                      ? JSON.parse(entry.metadata)?.image
                      : entry.token_uri;
                  if (url.includes("ipfs://")) {
                    return {
                      ...entry,
                      image: getIPFSUrl(url.replace("ipfs://", "")),
                    };
                  }
                  return { ...entry, image: url };
                } catch (e) {
                  return { ...entry, image: "/question-mark.png" };
                }
              })
              .sort((a, b) => {
                if (
                  a.image !== "/question-mark.png" &&
                  b.image === "/question-mark.png"
                )
                  return -1;
                if (
                  a.image === "/question-mark.png" &&
                  b.image !== "/question-mark.png"
                )
                  return 1;
                return 0;
              })
          );
        });
    }
  }, [address]);
  return nfts;
};

export const useMultiWalletNftHoldings = (addresses?: string[]) => {
  const params = useParams();
  const { nfts, setNfts, setIsNftLoading } = useContext(PortfolioV2Context);
  useEffect(() => {
    if (
      (addresses?.length > 0 && !nfts?.length) ||
      (nfts?.[0]?.minter_address !== params?.address && !nfts?.length)
    ) {
      // TODO: MINTER ADDRESS UNDEFINED => CHECK ON BACKEND
      const promises = addresses?.map((address) =>
        GET(
          "/api/1/wallet/nfts",
          {
            wallet: address,
          },
          false,
          {
            headers: {
              Authorization: "93ebcd82-7cea-48f2-9cd4-7ba999e15eb6",
            },
          }
        ).then((resp) => resp.json())
      );

      Promise.allSettled(promises).then((responses) => {
        const holdings = responses.reduce((acc, curr) => {
          if (curr.status === "rejected") return acc;
          if (curr.status === "fulfilled" && curr.value.error) return [...acc];
          return [...acc, ...curr.value.data];
        }, []);

        const filteredHoldings = holdings?.filter(
          (entry) =>
            !entry.name?.includes(".") &&
            !entry.symbol?.includes(".") &&
            // !blacklistedNft[entry.token_address] &&
            // !blacklistedUri[entry.token_uri] &&
            // !blacklistedName[entry.name] &&
            entry.token_id !== 0 &&
            !entry.name?.includes("$") &&
            !entry.name?.toLowerCase().includes("whitelist") &&
            !entry.name?.toLowerCase().includes("airdrop") &&
            !entry.name?.toLowerCase().includes("tickets") &&
            !entry.name?.toLowerCase().includes("reward") &&
            !entry.name?.toLowerCase().includes("event")
        );

        setNfts(
          filteredHoldings
            ?.map((entry) => {
              try {
                const url =
                  entry.metadata && JSON.parse(entry.metadata)?.image
                    ? JSON.parse(entry.metadata)?.image
                    : entry.token_uri;
                if (url.includes("ipfs://") || !url.includes("http")) {
                  return {
                    ...entry,
                    image: getIPFSUrl(url.replace("ipfs://", "")),
                  };
                }
                return { ...entry, image: url };
              } catch (e) {
                return { ...entry, image: "/question-mark.png" };
              }
            })
            .sort((a, b) => {
              if (
                a.image !== "/question-mark.png" &&
                b.image === "/question-mark.png"
              )
                return -1;
              if (
                a.image === "/question-mark.png" &&
                b.image !== "/question-mark.png"
              )
                return 1;
              return 0;
            })
        );
        setIsNftLoading(false);
      });
    }
  }, [addresses, params?.address]);

  return nfts;
};
