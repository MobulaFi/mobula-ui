import { Button } from "components/button";
import { NextImageFallback } from "components/image";
import React, { useContext, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import { SmallFont } from "../../../../../../components/fonts";
import { Modal } from "../../../../../../components/modal-container";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { GET } from "../../../../../../utils/fetch";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";

const supabase = createSupabaseDOClient();

export const ManageEdit = () => {
  const {
    setShowManage,
    activePortfolio,
    setActivePortfolio,
    setShowHiddenTokensPopup,
    hiddenTokens,
    showHiddenTokensPopup,
    setIsLoading,
  } = useContext(PortfolioV2Context);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [isCheck, setIsCheck] = useState<Record<number, boolean>>({});
  const { address } = useAccount();

  const refreshPortfolio = useWebSocketResp();

  const handleCheckboxChange = (tokenId: number) => {
    setIsCheck((prev) => ({
      ...prev,
      [tokenId]: !prev[tokenId],
    }));
  };

  const restoreHiddenAssets = async () => {
    if (activePortfolio) {
      setIsLoading(true);

      let updatedRemovedAssets = activePortfolio.removed_assets.filter(
        (tokenId) => !selectedTokens.includes(tokenId)
      );

      if (updatedRemovedAssets.length === 0) {
        updatedRemovedAssets = [];
      }

      const freshPortfolio = {
        ...activePortfolio,
        removed_assets: [...updatedRemovedAssets],
      };
      setActivePortfolio(freshPortfolio);
      refreshPortfolio(freshPortfolio);

      try {
        await GET("/portfolio/edit", {
          account: address as string,
          removed_assets: updatedRemovedAssets.join(","),
          removed_transactions: activePortfolio.removed_transactions.join(","),
          wallets: activePortfolio.wallets.join(","),
          id: activePortfolio.id,
          name: activePortfolio.name,
          reprocess: true,
          public: activePortfolio.public,
        });
      } catch (error) {
        // console.log(error);
      }

      setIsLoading(false);
      setShowHiddenTokensPopup(false);
      setShowManage(false);
    }
  };

  useEffect(() => {
    const newSelectedTokens = Object.keys(isCheck)
      .filter((id) => isCheck[Number(id)])
      .map(Number);
    setSelectedTokens(newSelectedTokens);
  }, [isCheck]);

  const handleRestoreAll = async () => {
    const freshPortfolio = {
      ...activePortfolio,
      removed_assets: [],
    };
    setActivePortfolio(freshPortfolio);
    refreshPortfolio(freshPortfolio);
    try {
      await GET("/portfolio/edit", {
        account: address as string,
        removed_assets: "",
        removed_transactions: activePortfolio.removed_transactions.join(","),
        wallets: activePortfolio.wallets.join(","),
        id: activePortfolio.id,
        name: activePortfolio.name,
        reprocess: true,
        public: activePortfolio.public,
      });
    } catch (error) {
      // console.log(error);
    }
    setShowHiddenTokensPopup(false);
    setShowManage(false);
  };

  return (
    <Modal
      extraCss="max-w-[400px]"
      title="Hidden assets"
      isOpen={showHiddenTokensPopup}
      onClose={() => setShowHiddenTokensPopup(false)}
    >
      <div className="flex flex-wrap">
        {Object.entries(hiddenTokens).map(([tokenId, tokenData], index) => (
          <div
            className={`flex items-center justify-between mt-2.5 p-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary
          border border-light-border-primary dark:border-dark-border-primary rounded-md w-full
           cursor-pointer hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200
            ease-in-out ${
              isCheck[Number(tokenId)] ? "opacity-40" : "opacity-100"
            }`}
            key={index}
            onClick={() => handleCheckboxChange(Number(tokenId))}
          >
            <div className="flex items-center">
              <NextImageFallback
                width={25}
                height={25}
                className="rounded-full"
                src={tokenData.logo}
                alt={`${tokenData.symbol} logo`}
                fallbackSrc={""}
              />
              <SmallFont extraCss="ml-2.5 font-normal">
                {tokenData.symbol}
              </SmallFont>
            </div>
            <div
              className="flex items-center justify-center rounded-md w-[15px] h-[15px] 
            border border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-hover dark:bg-dark-bg-hover"
            >
              <BsCheckLg
                className={`text-xs ${
                  isCheck[Number(tokenId)] ? "opacity-100" : "opacity-0"
                } transition-all duration-200 ease-in-out`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Button
          extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-2.5 h-[45px] w-full"
          onClick={restoreHiddenAssets}
        >
          Restore selected ({selectedTokens.length})
        </Button>
        <Button
          extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-2.5 h-[45px] w-full ml-2.5"
          onClick={handleRestoreAll}
        >
          Restore all
        </Button>{" "}
      </div>
    </Modal>
  );
};
