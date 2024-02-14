import { SmallFont } from "components/fonts";
import { NextImageFallback } from "components/image";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { Key, useContext, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Accordion } from "../../../../../components/accordion";
import { Modal } from "../../../../../components/modal-container";
import { BaseAssetContext } from "../../../context-manager";
import { TradeBlockchainPopup } from "../trade-blockchain-selector";
import { TradeTypePopup } from "../trade-type";
import { TradeValueAmountPopup } from "../trade-value-amount";

export const TradeFiltersPopup = () => {
  const {
    setShowTradeFilters,
    showTradeFilters,
    showTradeTokenAmount,
    setShowTradeTokenAmount,
    setShowTradeValue,
    showTradeValue,
  } = useContext(BaseAssetContext);
  const [activeNames, setActiveNames] = useState({
    liquidity_pool: "All Liquidity Pool",
    blockchain: "Any Blockchains",
    type: "All Types",
    token_amount: "Any Amount",
    value: "Any Value",
  });

  const filters = [
    {
      title:
        activeNames.blockchain !== "Any Blockchains" ? (
          <div className="flex items-center">
            <div className="flex items-center">
              {Array.isArray(activeNames.blockchain)
                ? activeNames.blockchain
                    .filter((_, i) => i < 4)
                    .map((item, i) => (
                      <NextImageFallback
                        className="rounded-full bg-light-bg-hover dark:bg-dark-bg-hover"
                        width={18}
                        height={18}
                        key={item}
                        alt={
                          blockchainsContent[activeNames.blockchain[i]]?.name
                        }
                        src={
                          blockchainsContent[activeNames.blockchain[i]]?.logo ||
                          `/logo/${
                            activeNames.blockchain[i]
                              ?.toLowerCase()
                              .split(" ")[0]
                          }.png`
                        }
                        fallbackSrc="/empty/unknown.png"
                      />
                    ))
                : null}
            </div>
            <SmallFont extraCss="ml-[5px]">
              {Array.isArray(activeNames.blockchain) &&
              activeNames.blockchain.length > 4
                ? `+${activeNames.blockchain.length - 4}`
                : null}
            </SmallFont>
          </div>
        ) : (
          activeNames.blockchain
        ),
      content: (
        <TradeBlockchainPopup
          setActiveName={setActiveNames}
          extraCss="py-2.5"
        />
      ),
    },
    // {
    //   title: "All Liquidity Pools",
    //   content: <TradeLiquidityPoolPopup />,
    // },
    {
      title: activeNames.type,
      content: (
        <TradeTypePopup setActiveName={setActiveNames} extraCss="pb-2.5" />
      ),
    },
    {
      title: activeNames.token_amount,
      content: (
        <TradeValueAmountPopup
          title="token_amount"
          state={showTradeTokenAmount}
          setStateValue={setShowTradeTokenAmount}
          setActiveName={setActiveNames}
          activeName={activeNames}
          extraCss="pb-2.5"
        />
      ),
    },
    {
      title: activeNames.value,
      content: (
        <TradeValueAmountPopup
          title="Value"
          state={showTradeValue}
          setStateValue={setShowTradeValue}
          setActiveName={setActiveNames}
          activeName={activeNames}
        />
      ),
    },
  ];

  return (
    <Modal
      extraCss="max-w-[400px] bg-light-bg-terciary dark:bg-dark-bg-terciary"
      title="Filters"
      isOpen={showTradeFilters}
      onClose={() => setShowTradeFilters(false)}
    >
      {filters.map((filter, index) => (
        <Accordion
          extraCss={`${
            index !== 0
              ? "border-t border-light-border-primary dark:border-dark-border-primary"
              : ""
          }`}
          key={filter.title as Key}
          visibleContent={
            <div className="flex items-center py-1 justify-between w-full text-[13px] text-light-font-100 dark:text-dark-font-100">
              <p>{filter?.title}</p>
              <BsChevronDown />
            </div>
          }
        >
          {filter.content}
        </Accordion>
      ))}
    </Modal>
  );
};
