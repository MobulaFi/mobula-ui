import { Button } from "components/button";
import { NextImageFallback } from "components/image";
import { ModalContainer } from "components/modal-container";
import { useContext, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import { SmallFont } from "../../../../../../components/fonts";
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

      activePortfolio.removed_assets = updatedRemovedAssets;

      const freshPortfolio = {
        ...activePortfolio,
        removed_assets: [...activePortfolio.removed_assets],
      };
      setActivePortfolio(freshPortfolio);
      refreshPortfolio(freshPortfolio);

      try {
        const data = await GET("/portfolio/edit", {
          account: address,
          removed_assets: [activePortfolio.removed_assets].join(","),
          removed_transactions: activePortfolio.removed_transactions.join(","),
          wallets: activePortfolio.wallets.join(","),
          id: activePortfolio.id,
          name: activePortfolio.name,
          reprocess: true,
          public: activePortfolio.public,
        });
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
      setShowHiddenTokensPopup(false);
    }
  };

  useEffect(() => {
    const newSelectedTokens = Object.keys(isCheck)
      .filter((id) => isCheck[Number(id)])
      .map(Number);
    setSelectedTokens(newSelectedTokens);
  }, [isCheck]);

  return (
    <ModalContainer
      extraCss="max-w-[400px]"
      title="Hidden assets"
      isOpen={showHiddenTokensPopup}
      onClose={() => setShowHiddenTokensPopup(false)}
    >
      <div className="flex flex-wrap">
        {Object.entries(hiddenTokens).map(([tokenId, tokenData], index) => (
          <div
            className={`flex items-center justify-center mt-2.5 p-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary
          border border-light-border-primary dark:border-dark-border-primary rounded w-calc-half-10
           cursor-pointer hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200
            ease-in-out ${index % 2 === 0 ? "mr-2.5" : "ml-2.5"}`}
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
              className="flex items-center justify-center rounded w-[15px] h-[15px] 
            border border-light-border-secondary dark:border-dark-border-secondary"
            >
              <BsCheckLg
                className={`text-[10px] ${
                  isCheck[Number(tokenId)] ? "opacity-100" : "opacity-0"
                } transition-all duration-200 ease-in-out`}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-2.5"
        onClick={() => {
          restoreHiddenAssets();
          setShowHiddenTokensPopup(false);
          setShowManage(false);
        }}
      >
        Delete from hidden assets ({selectedTokens.length})
      </Button>
    </ModalContainer>
  );
};
