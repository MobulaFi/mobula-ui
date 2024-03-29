import { LargeFont, SmallFont } from "components/fonts";
import { pushData } from "lib/mixpanel";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useState } from "react";
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg, BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../components/avatar";
import { Button } from "../../../components/button";
import { Collapse } from "../../../components/collapse";
import { Container } from "../../../components/container";
import { NextImageFallback } from "../../../components/image";
import { Input } from "../../../components/input";
import { Menu } from "../../../components/menu";
import { UserContext } from "../../../contexts/user";
import { useSignerGuard } from "../../../hooks/signer";
import { Switch } from "../../../lib/shadcn/components/ui/switch";
import { triggerAlert } from "../../../lib/toastify";
import { GET } from "../../../utils/fetch";
import { addressSlicer, getFormattedAmount } from "../../../utils/formaters";
import { CreatePortfolio } from "./components/popup/create-portfolio";
import { RenamePortfolio } from "./components/popup/rename-portfolio";
import { SharePopup } from "./components/popup/share";
import { colors, manageOptions } from "./constants";
import { PortfolioV2Context } from "./context-manager";
import { useWebSocketResp } from "./hooks";
import {
  boxStyle,
  buttonPopupStyle,
  buttonSquareStyle,
  flexGreyBoxStyle,
} from "./style";
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
    hiddenTokens,
    setHiddenTokens,
    isWalletExplorer,
    setShowHiddenTokensPopup,
    isLoading,
    activePortfolio,
    showPortfolioSelector,
    setShowPortfolioSelector,
    setShowCreatePortfolio,
    showCreatePortfolio,
    setUserPortfolio,
    wallet,
  } = useContext(PortfolioV2Context);
  const [isHover, setIsHover] = useState<null | number>(null);
  const [showPopover, setShowPopover] = useState<null | number[]>(null);
  const [showEditName, setShowEditName] = useState<number | false>(false);
  const [isCheck, setIsCheck] = useState<Record<number, boolean>>({});
  const { user } = useContext(UserContext);
  const [isCopied, setIsCopied] = useState("");
  const { address } = useAccount();
  const signerGuard = useSignerGuard();
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [showAddWallet, setShowAddWallet] = useState(false);
  const { showWallet, setActivePortfolio } = useContext(PortfolioV2Context);
  const refreshPortfolio = useWebSocketResp();
  const [activeTab, setActiveTab] = useState("wallets");
  const [showShare, setShowShare] = useState(false);

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

  const handleCheckboxChange = (tokenId: number) => {
    setIsCheck((prev) => ({
      ...prev,
      [tokenId]: !prev[tokenId],
    }));
  };

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
    if (
      isAddress(newWalletAddress) &&
      !activePortfolio.wallets.includes(newWalletAddress) &&
      activePortfolio.base_wallet !== newWalletAddress
    ) {
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
    } else {
      if (
        activePortfolio.wallets.includes(newWalletAddress) ||
        activePortfolio.base_wallet === newWalletAddress
      ) {
        triggerAlert("Error", "This wallet is already in your portfolio");
      } else {
        triggerAlert("Error", "The address should be a valid Ethereum address");
      }
    }
  };

  const supportedChainsName = Object.keys(blockchainsContent).filter(
    (entry) => blockchainsContent[entry].apiType === "etherscan-like"
  );

  const getSupportedChains = () => {
    let chains = [];
    const entries = Object.entries(blockchainsContent);
    supportedChainsName.forEach((chain) => {
      entries.forEach((entry, i) => {
        if (entry[0] === chain) chains.push(entry[1]);
      });
    });
    // Filter to be remove when all chains are supported
    const unsupportedForNow = ["Avalanche C-Chain", "Fantom", "Mantle"];
    chains = chains.filter((chain) => !unsupportedForNow.includes(chain.name));
    return chains;
  };

  const supportedChains = getSupportedChains();

  const removePortfolio = (id, name) => {
    GET("/portfolio/delete", { id, account: address })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) {
          triggerAlert(
            "Error",
            "Something went wrong while deleting your portfolio"
          );
          return;
        } else {
          triggerAlert("Success", "Successfully deleted your portfolio");
          setUserPortfolio(userPortfolio.filter((prev) => prev.name !== name));
        }
      });
  };

  return (
    <Container>
      <div className="flex ">
        <div className="flex flex-col w-[50%] mr-10">
          <div className="flex items-center">
            <button onClick={() => setShowCreatePortfolio(false)}>
              <LargeFont
                extraCss={`mr-5 ${
                  !showCreatePortfolio ? "" : "opacity-50"
                } hover:opacity-100 transition-all duration-200 ease-in-out`}
              >
                All Portfolios
              </LargeFont>{" "}
            </button>
            <button onClick={() => setShowCreatePortfolio(true)}>
              <LargeFont
                extraCss={`${
                  showCreatePortfolio ? "" : "opacity-50"
                } hover:opacity-100 transition-all duration-200 ease-in-out`}
              >
                Create a new portfolio
              </LargeFont>{" "}
            </button>
          </div>
          <div className="mb-[15px] max-h-[260px] overflow-y-scroll">
            {!showCreatePortfolio ? (
              <div className="mb-[15px]">
                {userPortfolio?.map((otherPortfolio, index) => {
                  const isActive = activePortfolio?.id === otherPortfolio.id;
                  const totalBalance = isActive
                    ? wallet?.estimated_balance || 0
                    : otherPortfolio.portfolio.reduce(
                        (acc, curr) => acc + curr.balance_usd,
                        0
                      );
                  const assets = isActive
                    ? wallet?.portfolio || []
                    : otherPortfolio.portfolio;

                  const finalAssets = assets
                    // This is bad, but name for Portfolio ("cache") holdings isn't the same as
                    // live (main) holdings. So we need to use the ||from balance_ud & estimated_balance
                    .map((a) => ({
                      ...a,
                      balance_usd: a.balance_usd || a.estimated_balance || 0,
                    }))
                    .sort((a, b) => {
                      if (a.balance_usd > b.balance_usd) return -1;
                      if (a.balance_usd < b.balance_usd) return 1;
                      return 0;
                    })
                    .slice(0, 10);
                  return (
                    <div className="flex flex-col" key={otherPortfolio.id}>
                      <div
                        className={`flex items-center justify-between transition-all duration-200 py-2.5 rounded-lg flex-col cursor-pointer ${
                          isActive || isHover === index ? "" : "opacity-40"
                        } pr-2.5`}
                        onMouseEnter={() => setIsHover(index)}
                        onMouseLeave={() => setIsHover(null)}
                      >
                        <div
                          className={`flex items-center w-full ${
                            finalAssets?.length > 0 ? "mb-2.5" : "mb-0"
                          }`}
                        >
                          <div
                            className="flex justify-between ml-2.5 w-full "
                            onClick={() => {
                              setShowPortfolioSelector(false);
                              setActivePortfolio(otherPortfolio);
                            }}
                          >
                            <SmallFont>{otherPortfolio.name}</SmallFont>
                            <div className="ml-auto flex w-fit">
                              {totalBalance ? (
                                <SmallFont className="text-light-font-40 dark:text-dark-font-40 font-normal">
                                  ${getFormattedAmount(totalBalance)}
                                </SmallFont>
                              ) : null}
                            </div>
                          </div>
                          <Menu
                            title={
                              <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100 ml-2.5" />
                            }
                          >
                            <div
                              className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs w-fit transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditName(otherPortfolio.id);
                              }}
                            >
                              <div
                                className={`${flexGreyBoxStyle} bg-light-bg-hover dark:bg-dark-bg-hover`}
                              >
                                <AiOutlineEdit className="text-light-font-100 dark:text-dark-font-100" />
                              </div>
                              Rename
                            </div>
                            <div
                              className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs mt-2.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePortfolio(
                                  otherPortfolio.id,
                                  otherPortfolio.name
                                );
                              }}
                            >
                              <div
                                className={`${flexGreyBoxStyle} bg-red dark:bg-red`}
                              >
                                <BsTrash3 className="text-light-font-100 dark:text-dark-font-100" />
                              </div>
                              <p className="whitespace-nowrap">
                                Delete Portfolio
                              </p>
                            </div>
                          </Menu>
                        </div>
                        {finalAssets?.length > 0 ? (
                          <div
                            className="mx-auto mb-[5px] flex"
                            style={{ width: "calc(100% - 20px)" }}
                          >
                            {finalAssets.map((asset, i) => (
                              <div
                                key={asset.asset_id}
                                className="flex h-[10px] mr-1"
                                style={{
                                  width: `${
                                    (asset.balance_usd / totalBalance) * 100
                                  }%`,
                                }}
                              >
                                <div
                                  key={asset.asset_id}
                                  className={`${colors[i]} w-full rounded-md h-[10px] relative`}
                                  onMouseOver={() =>
                                    setShowPopover([i, otherPortfolio.id])
                                  }
                                  onMouseLeave={() => setShowPopover(null)}
                                >
                                  {showPopover &&
                                  showPopover?.[0] === i &&
                                  showPopover?.[1] === otherPortfolio.id ? (
                                    <div
                                      className={
                                        "absolute z-[11] border top-[110%] right-0 border-light-border-primary dark:border-dark-border-primary rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary p-2.5 w-fit shadow-md"
                                      }
                                    >
                                      <div>
                                        <SmallFont className="mr-[5px] whitespace-nowrap">
                                          {asset.name}
                                        </SmallFont>{" "}
                                        <SmallFont className="text-light-font-60 dark:text-dark-font-60 font-normal">
                                          $
                                          {getFormattedAmount(
                                            asset.balance_usd
                                          )}
                                        </SmallFont>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <Collapse
                        startingHeight="0px"
                        isOpen={showEditName === otherPortfolio.id}
                      >
                        <RenamePortfolio
                          portfolio={otherPortfolio}
                          setShow={setShowEditName}
                          isManage
                        />
                      </Collapse>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pt-[15px]">
                <div className="flex flex-col w-full">
                  {/* ADD A WALLET */}
                  <Collapse startingHeight="0px" isOpen={showCreatePortfolio}>
                    <CreatePortfolio isManage />
                  </Collapse>
                  {showCreatePortfolio ? null : (
                    <div className="w-full flex">
                      <button
                        className="flex items-center text-sm lg:text-[13px] md:text-xs text-light-font-100 dark:text-dark-font-100"
                        onClick={() => setShowCreatePortfolio(true)}
                      >
                        <IoMdAddCircleOutline className="text-sm mr-[7.5px]" />
                        Create a new portfolio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-[50%] mx-auto h-fit">
          <div className="flex items-center">
            <button onClick={() => setActiveTab("wallets")}>
              <LargeFont
                extraCss={`mr-5 ${
                  activeTab === "wallets" ? "" : "opacity-50"
                } hover:opacity-100 transition-all duration-200 ease-in-out`}
              >
                Wallets
              </LargeFont>{" "}
            </button>
            <button onClick={() => setActiveTab("hidden assets")}>
              <LargeFont
                extraCss={`${
                  activeTab === "hidden assets" ? "" : "opacity-50"
                } hover:opacity-100 transition-all duration-200 ease-in-out`}
              >
                Hidden Assets
              </LargeFont>{" "}
            </button>
          </div>
          {activeTab === "hidden assets" ? (
            <>
              {Object.entries(hiddenTokens)?.length > 0 ? (
                <>
                  {Object.entries(hiddenTokens).map(
                    ([tokenId, tokenData], index) => (
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
                          className="flex items-center justify-center rounded-md w-[15px] h-[15px] 
            border border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-hover dark:bg-dark-bg-hover"
                        >
                          <BsCheckLg
                            className={`text-xs ${
                              isCheck[Number(tokenId)]
                                ? "opacity-100"
                                : "opacity-0"
                            } transition-all duration-200 ease-in-out`}
                          />
                        </div>
                      </div>
                    )
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] w-full">
                  <img
                    className="mb-3.5"
                    src="/empty/ray.png"
                    alt="crying ray image"
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
                    No hidden assets detected
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col max-h-[260px]">
              <div className="flex flex-col max-h-[224px] overflow-y-scroll">
                {activePortfolio.wallets?.map((walletAddress) => (
                  <div
                    className="flex items-center mt-2.5 mb-0.5 justify-between"
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
              {activePortfolio?.user === user?.id && (
                <div className="flex flex-col py-2.5">
                  <div className="flex flex-col w-full">
                    {/* ADD A WALLET */}
                    <Collapse startingHeight="0px" isOpen={showAddWallet}>
                      <div className="flex items-center justify-between mb-2.5 w-full">
                        <div className="flex items-center">
                          <SmallFont>Wallet Address</SmallFont>
                        </div>
                        <AiOutlineClose
                          className="cursor-pointer text-light-font-100 dark:text-dark-font-100 text-sm"
                          onClick={() => setShowAddWallet(false)}
                        />
                      </div>
                      <Input
                        extraCss="mb-2.5 w-full"
                        placeholder="0x"
                        value={newWalletAddress}
                        onChange={(e) => setNewWalletAddress(e.target.value)}
                      />
                      <div className="flex w-full">
                        <Button
                          extraCss={`border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary
                   dark:bg-dark-bg-terciary transition-all duration-200 mr-2.5 hover:bg-light-bg-hover
                    hover:dark:bg-dark-bg-hover w-2/4 ${buttonPopupStyle} h-[35px]`}
                          onClick={() => setShowAddWallet(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          extraCss={`border-darkblue dark:border-darkblue transition-all duration-200 hover:border-blue
                   hover:dark:border-blue w-2/4 ${buttonPopupStyle} h-[35px]`}
                          onClick={() => addWallet(newWalletAddress)}
                        >
                          Import
                        </Button>
                      </div>
                    </Collapse>
                    {showAddWallet ? null : (
                      <div className="flex w-full">
                        <button
                          className="text-sm lg:text-[13px] md:text-xs text-light-font-100 dark:text-dark-font-100 flex items-center justify-center"
                          onClick={() => setShowAddWallet(true)}
                        >
                          <IoMdAddCircleOutline className="text-base mr-[7.5px] text-light-font-100 dark:text-dark-font-100" />
                          Add another wallet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mb-2.5 mt-2.5 w-full">
        <p className="text-2xl md:text-lg">Manage your Portfolio</p>
        <div className="flex items-center">
          <p className="mr-4">Supported Chains:</p>
          {supportedChains.map((chain, i) => (
            <img
              key={chain.evmChainId}
              src={chain.logo}
              alt={chain.name}
              className="w-8 h-8 -ml-1.5 rounded-full bg-light-bg-hover dark:bg-dark-bg-hover border
               border-light-border-primary dark:border-dark-border-primary"
            />
          ))}
        </div>
      </div>
      <div className={`${boxStyle} flex-col font-medium w-full`}>
        <div className="flex flex-col w-full">
          <LargeFont extraCss="mt-2.5 mb-2.5">Portfolio Display</LargeFont>
          <div className="flex items-center justify-between">
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
                    <div className="flex flex-col">
                      <SmallFont>{option.title}</SmallFont>
                      <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                        {option.description}
                      </SmallFont>
                    </div>
                    <Switch
                      checked={manager[option.name]}
                      onClick={() => handleSwitch(option.name)}
                    />
                  </div>
                );
              return null;
            })}
          <LargeFont extraCss="mt-5 pt-2.5 border-t border-light-border-primary dark:border-dark-border-primary">
            Asset Informations
          </LargeFont>
          {manageOptions
            .filter((entry) => entry.type)
            .map((option, i) => {
              if (i > 6)
                return (
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex flex-col">
                      <SmallFont>{option.title}</SmallFont>
                      <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                        {option.description}
                      </SmallFont>
                    </div>
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
      <SharePopup show={showShare} setShow={setShowShare} />
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
