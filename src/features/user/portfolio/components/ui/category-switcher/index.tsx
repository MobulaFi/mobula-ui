import React, { useContext, useEffect } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BiCoinStack, BiImage } from "react-icons/bi";
import { LuDownload } from "react-icons/lu";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { pushData } from "../../../../../../lib/mixpanel";
import { triggerAlert } from "../../../../../../lib/toastify";
import { PortfolioV2Context } from "../../../context-manager";
import { buttonDeleteNft } from "../../../style";

export const CategorySwitcher = () => {
  const {
    manager,
    activeCategory,
    setActiveCategory,
    setNftsDeleted,
    setShowDeleteSelector,
    showDeleteSelector,
    activeStep,
    setAsset,
    asset,
    activePortfolio,
    hiddenTokens,
    setShowHiddenTokensPopup,
    showHiddenNfts,
    nftsDeleted,
    setShowHiddenNfts,
  } = useContext(PortfolioV2Context);

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
  ];
  useEffect(() => {
    setNftsDeleted(JSON.parse(localStorage.getItem("hiddenNft") as string));
  }, []);

  return (
    <div
      className={`flex justify-between items-center h-[30px] mb-[15px] md:mb-0 mt-5 md:mt-2.5 overflow-x-visible sm:overflow-x-scroll pb-0 sm:pb-2.5 ${
        !manager.portfolio_chart ? "mt-0" : "mt-5 md:mt-2.5"
      } w-full`}
    >
      <div className="flex lg:hidden">
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
                if (asset !== null) setAsset(null);
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
      {activeCategory === "Cryptos" &&
      activePortfolio?.removed_assets?.length > 0 ? (
        <Button onClick={() => setShowHiddenTokensPopup(true)}>
          <div className="flex items-center">
            <SmallFont extraCss="mr-1.5">
              Hidde assets ({Object.keys(hiddenTokens)?.length})
            </SmallFont>
            <AiOutlineSwap />
          </div>
        </Button>
      ) : null}
      {activeCategory === "Activity" ? (
        <div className="w-fit flex">
          <Button
            extraCss={buttonDeleteNft}
            onClick={() => {
              triggerAlert(
                "Information",
                "Coming soon, stay tuned Mobuler, we keep building!"
              );
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
          {!showDeleteSelector && !showHiddenNfts && nftsDeleted?.length > 0 ? (
            <Button
              extraCss={`${buttonDeleteNft} mr-2`}
              onClick={() => {
                setShowHiddenNfts(true);
              }}
            >
              Restore NFTs
            </Button>
          ) : null}
          {!showDeleteSelector && !showHiddenNfts ? (
            <Button
              extraCss={buttonDeleteNft}
              onClick={() => {
                if (!showDeleteSelector) setShowDeleteSelector(true);
              }}
            >
              Hide NFTs
            </Button>
          ) : null}
          {showDeleteSelector || showHiddenNfts ? (
            <Button
              extraCss={`${buttonDeleteNft} ml-2.5`}
              onClick={() => {
                setShowDeleteSelector(false);
                setShowHiddenNfts(false);
              }}
            >
              Done
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
