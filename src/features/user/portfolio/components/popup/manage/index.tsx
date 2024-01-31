import { Button } from "components/button";
import { Spinner } from "components/spinner";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { Modal } from "../../../../../../components/modal-container";
import { pushData } from "../../../../../../lib/mixpanel";
import { Switch } from "../../../../../../lib/shadcn/components/ui/switch";
import { manageOptions } from "../../../constants";
import { PortfolioV2Context } from "../../../context-manager";

export const ManagePopup = () => {
  const {
    showManage,
    setShowManage,
    manager,
    setShowNetwork,
    setManager,
    activeNetworks,
    setShowWallet,
    activePortfolio,
    hiddenTokens,
    setHiddenTokens,
    isWalletExplorer,
    setShowHiddenTokensPopup,
    isLoading,
  } = useContext(PortfolioV2Context);

  const handleSwitch = (name: string) => {
    pushData("Portfolio Settings Modified", {
      setting_name: name,
      new_value: !manager[name],
    });
    setManager({ ...manager, [name]: !manager[name] });
  };

  return (
    <Modal
      extraCss="max-w-[400px]"
      title="Manage"
      isOpen={showManage}
      onClose={() => setShowManage(false)}
    >
      <div className="flex items-center justify-between mt-2.5 hover:text-blue hover:dark:text-blue">
        <SmallFont>Hidden assets</SmallFont>
        <Button
          extraCss={`${
            Object.keys(hiddenTokens).length <= 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={Object.keys(hiddenTokens).length <= 0}
          onClick={() => {
            setShowHiddenTokensPopup(true);
            setShowManage(false);
          }}
        >
          Edit
          {isLoading ? (
            <Spinner extraCss="w-[16px] h-[16px] ml-[7.5px]" />
          ) : null}
        </Button>
      </div>
      {manageOptions
        .filter((entry) =>
          !entry.type && isWalletExplorer
            ? entry.title !== "Wallets" && !entry.type
            : entry && !entry.type
        )
        .map((option) => (
          <div
            key={option.title}
            className="flex items-center justify-between mt-2.5"
          >
            <SmallFont>{option.title}</SmallFont>
            {option.title === "Active Networks" ? (
              <Button
                extraCss="mb-0 mt-0"
                disabled
                onClick={() => {
                  setShowNetwork(true);
                  setShowManage(false);
                }}
              >
                <div className="flex items-center">
                  {activeNetworks
                    ?.filter((entry) => entry !== null)
                    .map((blockchain, i) => {
                      if (i < 6)
                        return (
                          <img
                            className="w-[16px] h-[16px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-full"
                            alt={`${blockchain} logo`}
                            src={blockchainsContent[blockchain]?.logo}
                          />
                        );
                      return null;
                    })}
                </div>
                <BiSolidChevronDown className="ml-[5px] text-sm text-light-font-100 dark:text-dark-font-100" />
              </Button>
            ) : (
              <Button
                extraCss="my-0"
                onClick={() => {
                  setShowWallet(true);
                  setShowManage(false);
                }}
              >
                {activePortfolio?.wallets?.length} Wallets
              </Button>
            )}
          </div>
        ))}
      <div className="flex items-center justify-between mt-2.5">
        <SmallFont>Show non-trade transactions</SmallFont>
        <Switch
          checked={manager.show_interaction}
          onClick={() =>
            setManager({
              ...manager,
              show_interaction: !manager.show_interaction,
            })
          }
        />
      </div>
      {manageOptions
        .filter((entry) =>
          entry.type && isWalletExplorer
            ? entry.title !== "Privacy Mode" && entry.type
            : entry.type
        )
        .map((option, i) => {
          if (i < 7)
            return (
              <div className="flex items-center justify-between mt-2.5">
                <SmallFont>{option.title}</SmallFont>
                <Switch
                  checked={manager[option.name]}
                  onClick={() => handleSwitch(option.name)}
                />
              </div>
            );
          return null;
        })}
      <LargeFont extraCss="mt-2.5 pt-2.5 border-t border-light-border-primary dark:border-dark-border-primary">
        Asset Informations
      </LargeFont>
      {manageOptions
        .filter((entry) => entry.type)
        .map((option, i) => {
          if (i > 6)
            return (
              <div className="flex items-center justify-between mt-2.5">
                <SmallFont>{option.title}</SmallFont>
                <Switch
                  checked={manager[option.name]}
                  onClick={() => handleSwitch(option.name)}
                />
              </div>
            );
          return null;
        })}
    </Modal>
  );
};
