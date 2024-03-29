import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useEffect } from "react";
import { BsCheckLg } from "react-icons/bs";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { triggerAlert } from "../../../../../lib/toastify";
import { BaseAssetContext } from "../../../context-manager";
import { cancelButtonStyle } from "../../../style";

interface TradeBlockchainPopupProps {
  onClose?: any;
  setActiveName: any;
  extraCss?: string;
}

export const TradeBlockchainPopup = ({
  onClose,
  setActiveName,
  extraCss,
}: TradeBlockchainPopupProps) => {
  const {
    setShowTradeFilters,
    setSelectedTradeFilters,
    selectedTradeFilters,
    baseAsset,
    setMarketMetrics,
    filters,
    setFilters,
    setShouldInstantLoad,
  } = useContext(BaseAssetContext);

  useEffect(() => {
    if ((selectedTradeFilters?.blockchains?.length as number) === 0)
      setSelectedTradeFilters((prevState) => ({
        ...prevState,
        blockchains: baseAsset?.blockchains,
      }));
  }, [baseAsset]);

  useEffect(() => {
    if ((selectedTradeFilters?.blockchains?.length as number) === 0)
      setSelectedTradeFilters((prevState) => ({
        ...prevState,
        blockchains: baseAsset?.blockchains,
      }));
  }, [baseAsset]);

  const handleAddFilter = (reset: boolean) => {
    setShouldInstantLoad(true);
    setMarketMetrics((prev) => ({
      ...prev,
      trade_history: [],
    }));
    const index = filters.findIndex(
      (entry) => entry.value[0] === "trade_history.blockchain"
    );
    if (index !== -1) filters.splice(index, 1);

    if (!reset)
      setActiveName((prev) => ({
        ...prev,
        blockchain: selectedTradeFilters.blockchains,
      }));

    const final = filters.filter(
      (f) => f.value[0] !== "trade_history.blockchain"
    );

    if (!reset) {
      final.push({
        action: "in",
        value: ["trade_history.blockchain", selectedTradeFilters.blockchains],
      });
    }
    setFilters(final);
    if (onClose) onClose();
    setShowTradeFilters(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full max-h-[390px] overflow-y-scroll scroll">
        {baseAsset?.blockchains?.map((entry, i) => {
          if (!entry) return null;
          return (
            <div
              className={`flex items-center cursor-pointer ${
                i === (baseAsset?.blockchains?.length || 0) - 1
                  ? "mb-0"
                  : "mb-[7.5px]"
              } ${i !== 0 ? "mt-[7.5px]" : "mt-0"}`}
              key={entry}
              onClick={() => {
                if (selectedTradeFilters?.blockchains?.includes(entry)) {
                  setSelectedTradeFilters((prevState) => ({
                    ...prevState,
                    blockchains: prevState?.blockchains?.filter(
                      (item) => item !== entry
                    ),
                  }));
                } else {
                  setSelectedTradeFilters((prev) => ({
                    ...prev,
                    blockchains: [
                      ...(selectedTradeFilters?.blockchains || []),
                      entry,
                    ],
                  }));
                }
              }}
            >
              <div className="flex items-center justify-center border border-light-border-secondary dark:border-dark-border-secondary w-[16px] h-[16px] min-w-[16px] rounded">
                <BsCheckLg
                  className={`text-xs text-light-font-100 dark:text-dark-font-100 ${
                    selectedTradeFilters?.blockchains?.includes(entry)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
              </div>
              <img
                className="ml-[15px] rounded-full w-[25px] h-[25px] min-w-[25px] mr-2.5"
                src={
                  blockchainsContent[entry]?.logo ||
                  `/logo/${entry.toLowerCase().split(" ")[0]}.png`
                }
                alt={`${entry} logo`}
              />
              <SmallFont extraCss="whitespace-nowrap text-start">
                {entry}
              </SmallFont>
            </div>
          );
        })}
        <div
          className={cn(
            "flex mt-2.5 pt-5 border-t border-light-border-primary dark:border-dark-border-primary sticky bottom-0 bg-light-bg-terciary dark:bg-dark-bg-terciary",
            extraCss
          )}
        >
          <Button
            extraCss={cancelButtonStyle}
            onClick={() => {
              setSelectedTradeFilters({
                ...selectedTradeFilters,
                blockchains: baseAsset?.blockchains,
              });
              setActiveName((prev) => ({
                ...prev,
                blockchain: "All Chains",
              }));
              setShouldInstantLoad(true);
              setShowTradeFilters(false);
              handleAddFilter(true);
              if (onClose) onClose();
            }}
          >
            Reset
          </Button>
          <Button
            extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue  max-w-[100px] w-full h-[30px]"
            onClick={() => {
              if ((selectedTradeFilters?.blockchains?.length as number) > 0) {
                handleAddFilter(false);
              } else
                triggerAlert("Error", "Please select at least one blockchain");
            }}
          >
            Apply
          </Button>{" "}
        </div>
      </div>
    </div>
  );
};
