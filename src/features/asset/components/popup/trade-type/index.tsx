import { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../context-manager";
import { cancelButtonStyle } from "../../../style";

interface TradeTypePopupProps {
  onClose?: any;
  setActiveName?: any;
  extraCss?: string;
}

export const TradeTypePopup = ({
  onClose,
  setActiveName,
  extraCss,
}: TradeTypePopupProps) => {
  const {
    setSelectedTradeFilters,
    setMarketMetrics,
    filters,
    setFilters,
    selectedTradeFilters,
    setShouldInstantLoad,
    setShowTradeFilters,
  } = useContext(BaseAssetContext);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSelectType = (type: string) => {
    if (selectedTradeFilters.type === type || type === "all") {
      setSelectedTradeFilters({
        ...selectedTradeFilters,
        type: null,
      });
    } else {
      setSelectedTradeFilters({
        ...selectedTradeFilters,
        type,
      });
    }
  };

  const handleAddFilter = (reset: boolean) => {
    setShouldInstantLoad(true);
    setMarketMetrics((prev) => ({
      ...prev,
      trade_history: [],
    }));
    const index = filters.findIndex(
      (entry) => entry.value[0] === "trade_history.type"
    );
    if (index !== -1) filters.splice(index, 1);
    if (reset) return;
    if (selectedTradeFilters.type !== null) {
      setActiveName((prev) => ({
        ...prev,
        type: `${capitalizeFirstLetter(selectedTradeFilters?.type || "")} Tx`,
      }));
      const final = filters.filter(
        (f) => f.value[0] !== "trade_history.blockchain"
      );
      final.push({
        action: "eq",
        value: ["trade_history.type", selectedTradeFilters.type || null],
      });
      setFilters(final);
    } else {
      setActiveName((prev) => ({
        ...prev,
        type: "All Types",
      }));
      setFilters([...filters]);
    }
    if (onClose) onClose();
    setShowTradeFilters(false);
  };
  const resetFilter = () => {
    handleSelectType("all");
    setSelectedTradeFilters({
      ...selectedTradeFilters,
      type: null,
    });
    handleAddFilter(true);
    setActiveName((prev) => ({
      ...prev,
      type: "All Types",
    }));
    if (onClose) onClose();
    setShowTradeFilters(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-[7.5px]">
        <button
          className="flex items-center"
          onClick={() => handleSelectType("buy")}
        >
          <div
            className="flex items-center justify-center w-[16px] h-[16px] rounded-md border
           border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary"
          >
            <BsCheckLg
              className={`text-[11px] text-light-font-100 dark:text-dark-font-100 ${
                selectedTradeFilters.type === "buy"
                  ? "opacity-100"
                  : "opacity-0"
              } transition-all duration-200 ease-in-out`}
            />
          </div>
          <div className="flex flex-col ml-[15px]">
            <SmallFont extraCss="text-green dark:text-green text-start whitespace-nowrap">
              Buy transactions
            </SmallFont>
          </div>
        </button>
      </div>
      <div className="flex items-center my-[7.5px]">
        <button
          className="flex items-center"
          onClick={() => handleSelectType("sell")}
        >
          <div
            className="flex items-center justify-center w-[16px] h-[16px] rounded-md border
           border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary"
          >
            <BsCheckLg
              className={`text-[11px] text-light-font-100 dark:text-dark-font-100 ${
                selectedTradeFilters.type === "sell"
                  ? "opacity-100"
                  : "opacity-0"
              } transition-all duration-200 ease-in-out`}
            />
          </div>
          <div className="flex flex-col ml-[15px]">
            <SmallFont extraCss="text-red dark:text-red text-start whitespace-nowrap">
              Sell transactions
            </SmallFont>
          </div>
        </button>
      </div>
      <div className="flex items-center my-[7.5px]">
        <button
          className="flex items-center"
          onClick={() => handleSelectType("all")}
        >
          <div
            className="flex items-center justify-center w-[16px] h-[16px] rounded-md border
             border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary"
          >
            <BsCheckLg
              className={`text-[11px] text-light-font-100 dark:text-dark-font-100  ${
                selectedTradeFilters.type === null ? "opacity-100" : "opacity-0"
              } transition-all duration-200 ease-in-out`}
            />
          </div>
          <div className="flex flex-col ml-[15px]">
            <SmallFont extraCss="text-start whitespace-nowrap">
              Buy/Sell transactions
            </SmallFont>
          </div>
        </button>
      </div>
      <div className={cn("flex mt-2.5", extraCss)}>
        <Button extraCss={`${cancelButtonStyle} w-2/4`} onClick={resetFilter}>
          Reset
        </Button>
        <Button
          extraCss="mb-0 w-2/4 h-[30px] max-w-[100px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
          onClick={() => handleAddFilter(false)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
