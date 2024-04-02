"use client";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../contexts/user";
import { Asset } from "../../../interfaces/assets";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { fromUrlToName } from "../../../utils/formaters";
import { PortfolioV2Context } from "./context-manager";
import { PortfolioMain } from "./main";
import { IPortfolio, UserHoldings } from "./models";

interface PortfolioProps {
  id?: string;
  asset?: string;
  address?: string;
  isWalletExplorer?: boolean;
}

export const setPortfolioCookies = (portfolio: IPortfolio) => {
  Cookies.set("portfolio", JSON.stringify(portfolio), {
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};

export const Portfolio = ({
  id,
  asset: assetName,
  address,
  isWalletExplorer,
}: PortfolioProps) => {
  const {
    wallet,
    setWallet,
    setAsset,
    setUserPortfolio,
    isAssetPage,
    setIsAssetPage,
    setActivePortfolio,
    activePortfolio,
    setIsWalletExplorer,
    setIsLoading,
    setIsRefreshing,
    setError,
    showPortfolioSelector,
    userPortfolio,
  } = useContext(PortfolioV2Context);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (activePortfolio) setPortfolioCookies(activePortfolio);
  }, [activePortfolio]);

  useEffect(() => {
    // ID means we're exploring, userPortfolio means we're on the user's portfolio
    const finalId = id || activePortfolio?.id;

    if (
      !isWalletExplorer &&
      finalId &&
      (!wallet || wallet.id !== finalId) &&
      Number(id) !== activePortfolio?.id
    ) {
      setIsLoading(true);

      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT
      );

      socket.addEventListener("open", () => {
        const settingsString = activePortfolio.wallets
          ? `, "settings": { "wallets": ${JSON.stringify(
              activePortfolio.wallets
            )}, "removed_assets": ${JSON.stringify(
              activePortfolio.removed_assets
            )}, "removed_transactions": ${JSON.stringify(
              activePortfolio.removed_transactions
            )}}`
          : "";

        socket.send(
          `{"portfolio": {"id": ${
            id || activePortfolio?.id
          }${settingsString} }, "force": true}`
        );
      });

      let failed = true;
      let portfolio: UserHoldings | null | { error: string; status: "error" } =
        null;

      socket.addEventListener("message", (event) => {
        try {
          const result = JSON.parse(event.data);
          if (result?.analysis && result.analysis !== null) {
            failed = false;

            if (result.analysis?.status === "error") {
              setError(
                "Invalid address. Mobula Portfolio does not support smart-contracts."
              );
              setWallet(null);
              setIsLoading(false);
            } else if (!("error" in result.analysis)) {
              failed = false;
              const filteredWallet = result.analysis.portfolio?.filter(
                (entry) => entry.price !== 0 && entry.name !== "Mobula"
              );
              const filteredPortfolio = {
                ...result.analysis,
                portfolio: filteredWallet,
              };
              setWallet({
                ...filteredPortfolio,
                id: Number(id) || Number(activePortfolio?.id),
                uniqueIdentifier: id || activePortfolio?.id,
              });
              portfolio = result.analysis;
            }
          } else if (failed) setWallet(null);
          setIsLoading(false);
          // Basically, refreshing will keep the little weel spinning while starting to display first data.
          setIsRefreshing(true);
        } catch (e) {
          if (event.data === "Goodbye.") {
            setIsRefreshing(false);
            if (failed) {
              setIsLoading(false);
              setWallet(null);
            }

            if (portfolio && user && "portfolio" in portfolio) {
              (window as any).mixpanel.identify(user.id);
              (window as any).mixpanel.people.set({
                account_balance: portfolio.estimated_balance,
              });
            }
          }
        }
      });
    }

    return () => {};
  }, [activePortfolio, isWalletExplorer]);

  useEffect(() => {
    // ID means we're exploring, userPortfolio means we're on the user's portfolio

    if (
      isWalletExplorer &&
      address &&
      (!wallet || wallet.addresses[0] !== address.toLowerCase())
    ) {
      if (
        typeof isWalletExplorer === "string"
          ? (isWalletExplorer as string).toLowerCase() !== address.toLowerCase()
          : true
      )
        setIsWalletExplorer(address);
      setIsLoading(true);

      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT as string
      );
      socket.addEventListener("open", () => {
        socket.send(`{"explorer": {"wallet": "${address}"}, "force": true}`);
      });

      let failed = true;
      socket.addEventListener("message", (event) => {
        try {
          const result = JSON.parse(event.data);

          if (result?.analysis !== null) {
            if (result.analysis?.status === "error") {
              setError(
                "Invalid address. Mobula Portfolio does not support smart-contracts."
              );
              setWallet(null);
              setIsLoading(false);
            } else {
              failed = false;
              const filteredWallet = result.analysis.portfolio.filter(
                (entry) => entry.price !== 0 && entry.name !== "Mobula"
              );
              const filteredPortfolio = {
                ...result.analysis,
                portfolio: filteredWallet,
              };
              setWallet({
                ...filteredPortfolio,
                uniqueIdentifier: address,
                // id: id || activePortfolio?.id,
              });
            }
          } else if (failed) setWallet(null);
          setIsLoading(false);
          // Basically, refreshing will keep the little weel spinning while starting to display first data.
          setIsRefreshing(true);
        } catch (e) {
          if (event.data === "Goodbye.") {
            setIsRefreshing(false);
            if (failed) {
              setIsLoading(false);
              setWallet(null);
            }
          }
        }
      });
      return () => {
        socket.close();
      };
    }

    return () => {};
  }, [isWalletExplorer, address]);

  useEffect(() => {
    if (user && !isWalletExplorer && !id) {
      const supabase = createSupabaseDOClient();
      supabase
        .from("portfolios")
        .select(
          "hidden_assets,id,name,public,removed_assets,removed_transactions,wallets,user,portfolio"
        )
        .eq("user", user.id)
        .order("last_cached", { ascending: false })
        .then((r) => {
          if (r.data) {
            setUserPortfolio(r.data);
            if (!id && r.data[0]?.id !== activePortfolio?.id) {
              setActivePortfolio(r.data[0]);
            } else if (Number(id) !== activePortfolio?.id && id)
              setActivePortfolio(
                r.data.find((entry) => entry.id === Number(id))
              );
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (!isWalletExplorer && id && String(activePortfolio?.id) !== id) {
      const supabase = createSupabaseDOClient();
      supabase
        .from("portfolios")
        .select(
          "hidden_assets,id,name,public,removed_assets,removed_transactions,wallets,user"
        )
        .eq("id", id)
        .then((r) => {
          if (r.data) {
            setActivePortfolio(r.data[0]);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (assetName && wallet?.portfolio) {
      const rightAsset = wallet?.portfolio.find(
        (entry) => entry.name.toLowerCase() === fromUrlToName(assetName)
      );
      setAsset({
        ...rightAsset,
        uniqueIdentifier: assetName,
      });
    }
  }, [wallet, assetName]);

  const threadId = useRef(Math.round(100000000 * Math.random()));
  useEffect(() => {
    let interval: any;

    if (wallet) {
      const supabase = createSupabaseDOClient();
      // We want to get the price of all the assets in the portfolio
      // If we're on the main page, we want to get the price of all the assets in the portfolio
      // If we're on the Portfolio selector, we iterate all portfolios assets
      const ids = showPortfolioSelector
        ? userPortfolio
            .map((entry) => entry.portfolio.map((asset) => asset.asset_id))
            .flat()
        : // We want to remove duplicates
          wallet?.portfolio?.map((entry) => entry.id);

      const updateAll = () => {
        supabase
          .from<Asset>("assets")
          .select("price,price_change_24h,id,name")
          .in("id", ids || [])
          .then((r) => {
            if (r.error) {
              return;
            }
            if (threadId.current !== threadId.current) return;

            const newWallet = { ...wallet };
            newWallet.estimated_balance = 0;

            newWallet.portfolio = newWallet?.portfolio?.map((entry) => {
              const newEntry = { ...entry };
              const asset = r.data.find(
                (e) => String(e.id) === String(entry.id)
              );
              newEntry.price = asset?.price as number;
              newEntry.change_24h = asset?.price_change_24h as number;
              newEntry.estimated_balance =
                (asset?.price || 0) * entry.token_balance;
              newWallet.estimated_balance += newEntry.estimated_balance;
              newEntry.estimated_balance_change =
                newEntry.estimated_balance - entry.estimated_balance > 0;

              // If the change is 0, we don't want to display it
              if (!(newEntry.estimated_balance - entry.estimated_balance))
                newEntry.estimated_balance_change = undefined;
              return newEntry;
            });

            if (newWallet && newWallet.estimated_history) {
              const lastIndex = newWallet.estimated_history.length - 1;
              if (lastIndex >= 0) {
                newWallet.estimated_history[lastIndex] = [
                  Date.now(),
                  newWallet.estimated_balance,
                ];
              } else {
                newWallet.estimated_history = [
                  [Date.now(), newWallet.estimated_balance],
                ];
              }
            } else if (newWallet) {
              newWallet.estimated_history = [
                [Date.now(), newWallet.estimated_balance],
              ];
            }

            newWallet.estimated_balance_change =
              newWallet.estimated_balance - wallet.estimated_balance > 0;

            if (!(newWallet.estimated_balance - wallet.estimated_balance))
              newWallet.estimated_balance_change = undefined;

            setWallet(newWallet);

            if (showPortfolioSelector) {
              for (let i = 0; i < userPortfolio.length; i += 1) {
                userPortfolio[i].portfolio = userPortfolio[i].portfolio.map(
                  (entry) => {
                    const newEntry = { ...entry };
                    const asset = r.data.find((e) => e.id === entry.asset_id);
                    newEntry.balance_usd = (asset?.price || 0) * entry.balance;
                    newEntry.name = asset?.name;
                    return newEntry;
                  }
                );
              }

              setUserPortfolio([...userPortfolio]);
            }
          });
      };

      interval = setInterval(() => {
        updateAll();
      }, 5000);
      // if (!isWalletExplorer) updateAll();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [wallet?.id, showPortfolioSelector, wallet?.portfolio?.length]);

  threadId.current = Math.round(100000000 * Math.random());

  return <PortfolioMain isExplorer={isWalletExplorer} />;
};
