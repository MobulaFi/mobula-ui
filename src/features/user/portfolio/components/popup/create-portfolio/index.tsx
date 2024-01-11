import { Collapse } from "components/collapse";
import { Switch } from "lib/shadcn/components/ui/switch";
import React, { useContext, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidWallet } from "react-icons/bi";
import { BsDatabaseDown, BsTrash3 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../../../../components/avatar";
import { Button } from "../../../../../../components/button";
import { SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { pushData } from "../../../../../../lib/mixpanel";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import { addressSlicer } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { IPortfolio } from "../../../models";
import { flexGreyBoxStyle } from "../../../style";

export const CreatePortfolio = () => {
  const { user } = useContext(UserContext);
  const signerGuard = useSignerGuard();
  const inputRef = useRef<HTMLInputElement>();
  const {
    setShowCreatePortfolio,
    setUserPortfolio,
    setActivePortfolio,
    userPortfolio,
    setShowPortfolioSelector,
    portfolioSettings,
    setPortfolioSettings,
  } = useContext(PortfolioV2Context);
  const { address } = useAccount();
  const [userWallet, setUserWallet] = useState("");

  const createPortfolio = () => {
    // Sometimes, the user won't click on the button to add the last wallet
    // So we add it here
    let finalWallets = portfolioSettings.wallets;
    if (userWallet !== "" && isAddress(userWallet))
      finalWallets = [...finalWallets, userWallet]
        .map((e) => e.toLowerCase())
        .filter((value, index, self) => self.indexOf(value) === index);

    const newPortfolio: IPortfolio = {
      user: user.id,
      name: portfolioSettings.name,
      public: portfolioSettings.public,
      wallets: finalWallets,
      removed_transactions: [],
      base_wallet: "",
      id: 0,
      last_cached: Date.now(),
      removed_assets: [],
      reprocess: false,
      hidden_assets: [],
      portfolio: [],
    };

    GET("/portfolio/create", {
      account: address,
      user: user.id,
      name: portfolioSettings.name,
      public: portfolioSettings.public,
      reprocess: true,
      wallets: finalWallets.join(","),
      removed_transactions: "[]",
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) {
          triggerAlert(
            "Error",
            "Something went wrong while creating a portfolio"
          );
          return;
        } else {
          triggerAlert("Success", "Successfully created a new portfolio");
          setUserPortfolio([
            ...userPortfolio,
            { ...newPortfolio, id: resp.id, base_wallet: resp.base_wallet },
          ]);
          setActivePortfolio({
            ...newPortfolio,
            id: resp.id,
            base_wallet: resp.base_wallet,
          });
          setShowPortfolioSelector(false);
        }
      });
    pushData("Portfolio Created");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-2.5 w-full mt-2.5">
        <div className="flex items-center">
          <BsDatabaseDown className="text-light-font-100 dark:text-dark-font-100 mr-[7.5px]" />
          <SmallFont>Portfolio name</SmallFont>
        </div>
        <button onClick={() => setShowCreatePortfolio(false)}>
          <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xs" />
        </button>
      </div>
      <Input
        extraCss="mb-[5px] w-full"
        placeholder="My Best Portfolio"
        value={portfolioSettings.name}
        onChange={(e) => {
          setPortfolioSettings((prev) => ({ ...prev, name: e.target.value }));
        }}
      />
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs lg:text-[11px] md:text-[10px] -mt-1 text-light-font-40 dark:text-dark-font-40">
          Make this portfolio public
        </p>
        <Switch
          className="mt-1"
          checked={portfolioSettings.public}
          onClick={() =>
            setPortfolioSettings((prev) => ({ ...prev, public: !prev.public }))
          }
        />
      </div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center">
          <BiSolidWallet className="text-light-font-100 dark:text-dark-font-100 mr-[7.5px]" />
          <SmallFont>Add wallet</SmallFont>
        </div>
      </div>
      <div className="flex mb-2.5">
        <Input
          extraCss="w-full border border-light-border-primary dark:border-dark-border-primary"
          ref={inputRef}
          placeholder="0x"
          onChange={(e) => {
            setUserWallet(e.target.value);
          }}
        />
        <Button
          extraCss="ml-2.5 h-[35px]"
          onClick={() => {
            if (!isAddress(userWallet)) {
              triggerAlert(
                "Error",
                "Mobula only support EVM addresses for now. Verify the address input"
              );
              return;
            }
            if (!portfolioSettings.wallets.includes(userWallet)) {
              setPortfolioSettings((prev) => ({
                ...prev,
                wallets: [...prev.wallets, userWallet],
              }));
            } else {
              triggerAlert("Warning", "This wallet has already been added");
              setUserWallet("");
            }
          }}
        >
          <IoMdAddCircleOutline className="text-light-font-100 dark:text-dark-font-100" />
        </Button>
      </div>
      <Collapse
        isOpen={portfolioSettings.wallets.length > 0}
        startingHeight={"max-h-[0px]"}
      >
        <div className="flex flex-col mb-2.5 w-full ">
          {portfolioSettings.wallets?.map((entry, index) => (
            <div
              key={entry}
              className="flex items-center justify-between mb-[5px] w-full"
            >
              <div
                className={`flex items-center ml-0.5 ${
                  index !== portfolioSettings.wallets.length - 1
                    ? "mb-[5px]"
                    : "mb-0"
                }`}
              >
                <AddressAvatar
                  extraCss="w-[28px] h-[28px] min-w-[28px]"
                  address={entry}
                />
                <div className="flex flex-col ml-2.5">
                  <SmallFont>{addressSlicer(entry)}</SmallFont>
                </div>
              </div>
              <button
                className="w-fit h-fit ml-auto"
                onClick={() => {
                  setPortfolioSettings((prev) => ({
                    ...prev,
                    wallets: prev.wallets.filter((wallet) => wallet !== entry),
                  }));
                }}
              >
                <div
                  className={`${flexGreyBoxStyle} bg-light-bg-hover dark:bg-dark-bg-hover mr-[3px]`}
                >
                  <BsTrash3 className="text-light-font-100 dark:text-dark-font-100" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </Collapse>
      <div className="flex">
        <Button
          extraCss="w-full border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue h-[35px]"
          onClick={() => {
            signerGuard(() => {
              if (portfolioSettings.name !== "") {
                createPortfolio();
                setShowCreatePortfolio(false);
              } else
                triggerAlert(
                  "Warning",
                  "You should add a name for your portfolio"
                );
            });
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};
