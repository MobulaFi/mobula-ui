import { LargeFont, SmallFont } from "components/fonts";
import { pushData } from "lib/mixpanel";
import React, { useContext, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../components/avatar";
import { Container } from "../../../components/container";
import { NextImageFallback } from "../../../components/image";
import { UserContext } from "../../../contexts/user";
import { useSignerGuard } from "../../../hooks/signer";
import { Switch } from "../../../lib/shadcn/components/ui/switch";
import { GET } from "../../../utils/fetch";
import { addressSlicer } from "../../../utils/formaters";
import { manageOptions } from "./constants";
import { PortfolioV2Context } from "./context-manager";
import { useWebSocketResp } from "./hooks";
import { boxStyle, buttonSquareStyle } from "./style";
import { copyText } from "./utils";

export const Manage = () => {
  const {
    showManage,
    setShowManage,
    userPortfolio,
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
    wallet,
  } = useContext(PortfolioV2Context);
  const [isCheck, setIsCheck] = useState<Record<number, boolean>>({});

  const getTopHoldings = () => {
    const topHoldings = wallet?.portfolio
      ?.filter((asset) => asset.estimated_balance > 0)
      .sort((a, b) => b.estimated_balance - a.estimated_balance)
      .slice(0, 4);
    return topHoldings;
  };
  const topHoldings = getTopHoldings();

  const handleSwitch = (name: string) => {
    pushData("Portfolio Settings Modified", {
      setting_name: name,
      new_value: !manager[name],
    });
    setManager({ ...manager, [name]: !manager[name] });
  };

  //   console.log("wallets", wallet);
  //   console.log("manager", manager);
  //   console.log("activePortfolio", activePortfolio);
  console.log("portfolio", hiddenTokens);

  const handleCheckboxChange = (tokenId: number) => {
    setIsCheck((prev) => ({
      ...prev,
      [tokenId]: !prev[tokenId],
    }));
  };

  const { user } = useContext(UserContext);
  const [isCopied, setIsCopied] = useState("");
  const { address } = useAccount();
  const signerGuard = useSignerGuard();
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [showAddWallet, setShowAddWallet] = useState(false);
  const { showWallet, setActivePortfolio } = useContext(PortfolioV2Context);
  const refreshPortfolio = useWebSocketResp();

  const removeWallet = (walletAddress: string) => {
    signerGuard(() => {
      pushData("Wallet Removed");
      const newPortfolio = {
        ...activePortfolio,
        wallets: activePortfolio.wallets.filter(
          (iteratedWallet) => iteratedWallet !== walletAddress
        ),
      };
      GET("/portfolio/edit", {
        id: activePortfolio.id,
        name: newPortfolio.name,
        public: newPortfolio.public,
        wallets: newPortfolio.wallets.join(","),
        removed_transactions: newPortfolio.removed_transactions.join(","),
        removed_assets: newPortfolio.removed_assets.join(","),

        reprocess: true,
        account: address,
      });

      setActivePortfolio(newPortfolio);
      setShowWallet(false);

      setTimeout(() => {
        refreshPortfolio();
      }, 2000);
    });
  };

  const addWallet = (newWalletAddress: string) => {
    if (isAddress(newWalletAddress)) {
      signerGuard(() => {
        const newPortfolio = {
          ...activePortfolio,
          wallets: [...activePortfolio.wallets, newWalletAddress],
        };
        pushData("Wallet Added");
        GET("/portfolio/edit", {
          id: newPortfolio.id,
          name: newPortfolio.name,
          public: newPortfolio.public,
          reprocess: true,
          wallets: newPortfolio.wallets.join(","),
          removed_transactions: newPortfolio.removed_transactions.join(","),
          removed_assets: newPortfolio.removed_assets.join(","),
          account: address,
        });
        setActivePortfolio(newPortfolio);
        refreshPortfolio(newPortfolio);

        setShowAddWallet(false);
        setShowWallet(false);
        setNewWalletAddress("");
      });
    }
  };

  return (
    <Container>
      <div className="flex items-center justify-between mb-2.5 w-full">
        <p className="text-2xl font-poppins md:text-lg">
          Manage your Portfolio
        </p>
        <p className="text-2xl font-poppins md:text-lg">
          Manage your Portfolio
        </p>
      </div>
      <div className="flex mt-2.5">
        <div
          className={`${boxStyle} flex-col border border-light-border-primary dark:border-dark-border-primary
    bg-light-bg-secondary dark:bg-dark-bg-secondary font-medium p-5 w-[40%] mr-5`}
        >
          <LargeFont>Manage {activePortfolio.name}</LargeFont>
          <div className="flex flex-col w-full">
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
          </div>
        </div>
        <div className="flex flex-col w-[50%] mx-auto h-fit">
          <LargeFont>Hidden Assets</LargeFont>
          {Object.entries(hiddenTokens).map(([tokenId, tokenData], index) => (
            <div
              className={`flex items-center justify-between mt-2.5 p-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary
          border border-light-border-primary dark:border-dark-border-primary rounded-xl w-full
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
                className="flex items-center justify-center rounded w-[15px] h-[15px] 
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
          <LargeFont extraCss="mt-8">Wallets</LargeFont>
          {activePortfolio.wallets?.map((walletAddress) => (
            <div
              className="flex items-center mt-2.5 justify-between"
              key={walletAddress}
            >
              <div className="flex items-center">
                <AddressAvatar
                  extraCss="min-w-[32px] w-[32px] h-[32px]"
                  address={walletAddress}
                />
                <div className="flex flex-col ml-2.5">
                  <SmallFont className="font-normal">
                    {addressSlicer(walletAddress, 8)}
                  </SmallFont>
                </div>
              </div>
              <div className="flex">
                <button
                  className={`${buttonSquareStyle} bg-light-bg-hover dark:bg-dark-bg-hover`}
                  onClick={() => {
                    copyText(walletAddress, setIsCopied);
                  }}
                >
                  {isCopied === walletAddress ? (
                    <BsCheckLg className="text-green dark:text-green" />
                  ) : (
                    <BiCopy className="text-light-font-60 dark:text-dark-font-60 hover:text-light-font-60 hover:dark:text-dark-font-100 transition-all" />
                  )}
                </button>
                {activePortfolio?.user === user?.id && (
                  <button
                    className={`${buttonSquareStyle} bg-light-bg-hover dark:bg-dark-bg-hover ml-1.5`}
                    onClick={() => removeWallet(walletAddress)}
                  >
                    <AiOutlineDelete className="text-light-font-60 dark:text-dark-font-60 hover:text-red hover:dark:text-red transition-all" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

// {topHoldings?.map((asset) => (
//     <div className="flex items-center mt-5" key={asset.id}>
//       <img
//         className="w-[32px] h-[32px] min-w-[32px] mr-2.5"
//         src={asset.image}
//         alt={asset.name}
//       />
//       <div className="flex flex-col">
//         <SmallFont>{asset.name}</SmallFont>
//         <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
//           {asset.symbol}
//         </SmallFont>
//       </div>
//     </div>
//   ))}
