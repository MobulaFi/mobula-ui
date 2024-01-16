import React, { useContext, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { BsThreeDotsVertical, BsTrash3 } from "react-icons/bs";
import { useAccount } from "wagmi";
import { Collapse } from "../../../../../../components/collapse";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { Modal } from "../../../../../../components/modal-container";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { colors } from "../../../constants";
import { PortfolioV2Context } from "../../../context-manager";
import { flexGreyBoxStyle } from "../../../style";
import { CreatePortfolio } from "../create-portfolio";
import { RenamePortfolio } from "../rename-portfolio";

export const SelectorPortfolioPopup = () => {
  const {
    activePortfolio,
    showPortfolioSelector,
    setShowPortfolioSelector,
    setShowCreatePortfolio,
    showCreatePortfolio,
    userPortfolio,
    setActivePortfolio,
    setUserPortfolio,
    wallet,
  } = useContext(PortfolioV2Context);
  const [isHover, setIsHover] = useState<null | number>(null);
  const [showPopover, setShowPopover] = useState<null | number[]>(null);
  const [showEditName, setShowEditName] = useState<number | false>(false);
  const { address } = useAccount();

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
    <Modal
      extraCss="max-w-[400px]"
      isOpen={showPortfolioSelector}
      onClose={() => setShowPortfolioSelector(false)}
      title={
        <>
          <LargeFont>My Portfolios</LargeFont>
          <MediumFont>
            Total:{" "}
            {`$${getFormattedAmount(
              userPortfolio.reduce((acc, otherPortfolio) => {
                if (
                  otherPortfolio.portfolio &&
                  otherPortfolio.id !== activePortfolio.id
                ) {
                  return (
                    acc +
                    otherPortfolio.portfolio.reduce(
                      (balance, curr) => balance + curr.balance_usd,
                      0
                    )
                  );
                }
                return acc;
              }, 0) + (wallet?.estimated_balance || 0)
            )}`}{" "}
          </MediumFont>
        </>
      }
    >
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
                className={`flex items-center justify-between mt-2.5 transition-all duration-200 py-2.5 rounded-lg flex-col cursor-pointer ${
                  isActive || isHover === index
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : ""
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
                        removePortfolio(otherPortfolio.id, otherPortfolio.name);
                      }}
                    >
                      <div className={`${flexGreyBoxStyle} bg-red dark:bg-red`}>
                        <BsTrash3 className="text-light-font-100 dark:text-dark-font-100" />
                      </div>
                      <p className="whitespace-nowrap">Delete Portfolio</p>
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
                          width: `${(asset.balance_usd / totalBalance) * 100}%`,
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
                                  ${getFormattedAmount(asset.balance_usd)}
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
                startingHeight="max-h-[0px]"
                isOpen={showEditName === otherPortfolio.id}
              >
                <RenamePortfolio
                  portfolio={otherPortfolio}
                  setShow={setShowEditName}
                />
              </Collapse>
            </div>
          );
        })}
      </div>
      <div className="border-t border-light-border-primary dark:border-dark-border-primary">
        <div className="flex flex-col w-full pt-2.5">
          {/* ADD A WALLET */}
          <div className="w-full flex">
            <button
              className="flex items-center text-base md:text-sm text-light-font-100 dark:text-dark-font-100 justify-between w-full"
              onClick={() => setShowCreatePortfolio((prev) => !prev)}
            >
              Create a new portfolio
              <BiChevronDown className="text-lg" />
            </button>
          </div>
          <Collapse startingHeight="max-h-[0px]" isOpen={showCreatePortfolio}>
            <CreatePortfolio />
          </Collapse>
        </div>
      </div>
    </Modal>
  );
};
