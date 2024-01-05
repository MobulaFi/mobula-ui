import { useContext } from "react";
import { PortfolioV2Context } from "../context-manager";
import { IPortfolio } from "../models";

export const useWebSocketResp = () => {
  const {
    activePortfolio: unsafeActivePortfolio,
    setWallet,
    setIsLoading,
    setIsRefreshing,
    isWalletExplorer,
    setError,
  } = useContext(PortfolioV2Context);

  const refreshPortfolio = (activePortfolioBuffer?: IPortfolio) => {
    const activePortfolio = activePortfolioBuffer || unsafeActivePortfolio;
    if (activePortfolio) {
      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT
      );
      setIsLoading(true);
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
          isWalletExplorer
            ? `{"explorer": {"wallet": "${isWalletExplorer}"}, "force": true}`
            : `{"portfolio": {"id": ${activePortfolio?.id} ${settingsString}}, "force": true}`
        );
      });
      let failed = true;
      socket.addEventListener("message", (event) => {
        try {
          const portfolio = JSON.parse(event.data);
          if (portfolio !== null) {
            if (portfolio.status === "error") {
              setIsLoading(false);
              setIsRefreshing(false);
              setError(
                "Invalid address. Mobula Portfolio does not support smart-contracts."
              );
              setWallet(null);
            } else {
              failed = false;
              const filteredWallet = portfolio.portfolio.filter(
                (entry) => entry.price !== 0 && entry.name !== "Mobula"
              );
              const filteredPortfolio = {
                ...portfolio,
                portfolio: filteredWallet,
              };

              setWallet({
                ...filteredPortfolio,
                uniqueIdentifier: isWalletExplorer || activePortfolio?.id,
              });
            }
          } else if (failed) setWallet(null);
          setIsLoading(false);
          setIsRefreshing(true);
        } catch (e) {
          if (event.data === "Goodbye.") {
            setIsRefreshing(false);
            if (failed) {
              setIsLoading(false);
              setWallet(null);
            }
          }
          // setIsLoading(false);
        }
      });
    }
  };

  return refreshPortfolio;
};
