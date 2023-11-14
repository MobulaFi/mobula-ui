import { useContext, useEffect } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BiCoinStack, BiImage } from "react-icons/bi";
import { LuDownload } from "react-icons/lu";
import { RiBankLine } from "react-icons/ri";
import { Button } from "../../../../../../components/button";
import { MediumFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { pushData } from "../../../../../../lib/mixpanel";
import { PortfolioV2Context } from "../../../context-manager";
import { buttonDeleteNft } from "../../../style";

export const CategorySwitcher = () => {
  const {
    manager,
    activeCategory,
    setActiveCategory,
    setNftsDeleted,
    setNftToDelete,
    nftToDelete,
    setShowDeleteSelector,
    showDeleteSelector,
    activeStep,
  } = useContext(PortfolioV2Context);
  // const alert = useAlert();

  const categories = [
    {
      title: "Cryptos",
      icon: <BiCoinStack className="mr-[7.5px]" />,
    },
    {
      title: "NFTs",
      icon: <BiImage className="mr-[7.5px]" />,
    },
    {
      title: "Activity",
      icon: <AiOutlineSwap className="mr-[7.5px]" />,
    },
    {
      title: "Staking",
      icon: <RiBankLine className="mr-[7.5px]" />,
    },
  ];
  useEffect(() => {
    setNftsDeleted(JSON.parse(localStorage.getItem("hiddenNft") as string));
  }, []);

  const getNftHidden = () => {
    const arrToDelete =
      JSON.parse(localStorage.getItem("hiddenNft") as string) || [];
    nftToDelete?.forEach((nft) => {
      if (!arrToDelete.includes(nft)) {
        arrToDelete.push(nft);
      }
    });
    localStorage.setItem("hiddenNft", JSON.stringify(arrToDelete));
    setNftsDeleted(arrToDelete);
    setNftToDelete([]);
    setShowDeleteSelector(false);
  };
  return (
    <div
      className={`flex justify-between items-center my-[25px] overflow-x-visible sm:overflow-x-scroll pb-0 sm:pb-2.5 ${
        !manager.portfolio_chart ? "mt-0" : "mt-[25px]"
      } w-full`}
    >
      <div className="flex">
        {categories.map((entry, i) => (
          <div
            key={entry.title}
            className={`flex items-center ${
              entry.title === "Activity" && activeStep.nbr === 4
                ? "z-[5]"
                : "z-0"
            }`}
          >
            <button
              className={`flex items-center ${
                activeCategory === entry.title
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
              disabled={entry.title === "Staking"}
              onClick={() => {
                if (entry.title === "Cryptocurrencies")
                  setActiveCategory("Cryptos");
                else setActiveCategory(entry.title);

                pushData("Portfolio Switch Clicked", {
                  type: entry.title,
                });
              }}
            >
              {entry.icon}
              <MediumFont
                extraCss={`${
                  activeCategory === entry.title
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-40 dark:text-dark-font-40"
                }`}
              >
                {entry.title}
              </MediumFont>
            </button>
            <div
              className={`h-[20px] w-[2px] bg-light-border-primary dark:bg-dark-border-primary mx-5 rounded-full ${
                i !== categories.length - 1 ? "flex" : "hidden"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="ml-auto flex text-xs mr-2.5">
        Need data?
        <NextChakraLink
          href="https://developer.mobula.fi/reference/wallet-explorer-api?utm_source=website&utm_medium=portfolio&utm_campaign=portfolio"
          target="_blank"
          rel="noreferrer"
          extraCss="text-blue dark:text-blue ml-[5px]"
          onClick={() => {
            pushData("API Clicked");
          }}
        >
          Check our API
        </NextChakraLink>
      </div>
      {activeCategory === "Activity" ? (
        <div className="w-fit flex">
          <Button
            extraCss={buttonDeleteNft}
            onClick={() => {
              // alert.show("Coming soon, stay tuned Mobuler, we keep building!");
              pushData("Export CSV Clicked");
            }}
          >
            CSV
            <LuDownload className="ml-[5px]" />
          </Button>
        </div>
      ) : null}
      {activeCategory === "NFTs" ? (
        <div className="flex w-fit">
          {(nftToDelete.length > 0 && showDeleteSelector) ||
          !showDeleteSelector ? (
            <Button
              extraCss={buttonDeleteNft}
              onClick={() => {
                if (!showDeleteSelector) setShowDeleteSelector(true);
                else getNftHidden();
              }}
            >
              {nftToDelete?.length > 0
                ? `Hide (${nftToDelete.length})`
                : "Manage NFTs"}
            </Button>
          ) : null}

          {showDeleteSelector ? (
            <Button
              extraCss={`${buttonDeleteNft} ml-2.5`}
              onClick={() => {
                setShowDeleteSelector(false);
                setNftToDelete([]);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
