import { NextImageFallback } from "components/image";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { SmallFont } from "../../../../../../components/fonts";
import { Modal } from "../../../../../../components/modal-container";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";

export const NetworkPopup = () => {
  const {
    setShowNetwork,
    showNetwork,
    activeNetworks,
    setActiveNetworks,
    wallet,
  } = useContext(PortfolioV2Context);

  const getBlockchainsAmount = () => {
    if (wallet && wallet?.portfolio) {
      const tokens = wallet?.portfolio.map(
        (entry) => entry.cross_chain_balances
      );
      const combinedObject = tokens?.reduce(
        (accumulator, currentObject) => ({ ...accumulator, ...currentObject }),
        {}
      );
      return combinedObject;
    }
    return 0;
  };

  return (
    <Modal
      title="Active Network"
      extraCss="max-w-[400px]"
      isOpen={showNetwork}
      onClose={() => {
        setShowNetwork(false);
      }}
    >
      <div className="w-full p-0 max-h-[420px] overflow-y-scroll">
        {Object.values(blockchainsContent).map((blockchain, i) => {
          const isOdds = i % 2 === 0;
          const isBnb = blockchain.name === "BNB Smart Chain (BEP20)";
          const isAvax = blockchain.name === "Avalanche C-Chain";
          const getName = () => {
            if (isBnb) return "BNB Smart Chain";
            if (isAvax) return "Avalanche";
            return blockchain.name;
          };
          const isActiveNetwork = activeNetworks.includes(blockchain.name);

          return (
            <button
              className={`flex items-center justify-center w-[48%] ${
                isOdds ? "mr-[5px]" : ""
              } h-[58px] rounded-md px-[15px] mb-[5px] ${
                isActiveNetwork
                  ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  : ""
              }`}
              key={blockchain.name}
              onClick={() => {
                if (isActiveNetwork)
                  setActiveNetworks(
                    activeNetworks.filter(
                      (network) => network !== blockchain.name
                    )
                  );
                else setActiveNetworks([...activeNetworks, blockchain.name]);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center jsutify-start">
                    <NextImageFallback
                      width={20}
                      height={20}
                      className="rounded-full"
                      src={blockchain.logo}
                      alt={`${blockchain.name} logo`}
                      fallbackSrc={""}
                    />
                    <SmallFont extraCss="whitespace-pre-wrap text-start ml-[7.5px]">
                      {getName()}
                    </SmallFont>
                  </div>
                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[27.5px]">
                    $
                    {getBlockchainsAmount()[blockchain.name]
                      ? getFormattedAmount(
                          getBlockchainsAmount()[blockchain.name]
                        )
                      : 0}
                  </SmallFont>
                </div>
                {isActiveNetwork ? (
                  <BsCheckLg className="text-blue dark:text-blue ml-2.5" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
