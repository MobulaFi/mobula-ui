import React, { useContext, useRef, useState } from "react";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { Input } from "../../../../../components/input";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../context-manager";
import { cancelButtonStyle } from "../../../style";

interface TradeValueAmountPopupProps {
  onClose?: any;
  title: string;
  state?: boolean;
  setActiveName: any;
  activeName: any;
  setStateValue?: React.Dispatch<React.SetStateAction<boolean>>;
  extraCss?: string;
}

export const TradeValueAmountPopup = ({
  title,
  state,
  onClose,
  setStateValue,
  setActiveName,
  extraCss,
  activeName,
}: TradeValueAmountPopupProps) => {
  const {
    setSelectedTradeFilters,
    setMarketMetrics,
    filters,
    setFilters,
    selectedTradeFilters,
    setShouldInstantLoad,
    setShowTradeFilters,
  } = useContext(BaseAssetContext);
  const maxRef = useRef(null);
  const minRef = useRef(null);
  const lastMax = Number(
    activeName[title.toLowerCase()].split(" - ")?.[1] === "Any"
      ? 1000000000000
      : Number(activeName[title.toLowerCase()].split(" - ")?.[1]) || 0
  );
  const lastMin = Number(activeName[title.toLowerCase()].split(" - ")?.[0]);
  const [max, setMax] = useState(lastMax === 0 ? 1000000000000 : lastMax);
  const [min, setMin] = useState(lastMin || 0);

  const handleAddFilter = (init: boolean) => {
    let req: string;
    if (title === "Value") req = "trade_history.value_usd";
    if (title === "token_amount") req = "trade_history.token_amount";
    let filterName: string;
    if (title === "Value") filterName = "value";
    if (title === "token_amount") filterName = "token_amount";
    setShouldInstantLoad(true);
    setMarketMetrics((prev) => ({
      ...prev,
      trade_history: [],
    }));

    setActiveName((prev) => ({
      ...prev,
      [filterName]: `${selectedTradeFilters[filterName][0]} - ${
        selectedTradeFilters[filterName][1] === 1000000000000
          ? "Any"
          : selectedTradeFilters[filterName][1]
      }`,
    }));

    if (init) {
      return;
    }

    const arr = [1, 2];
    arr.forEach(() => {
      const index = filters.findIndex((entry) => entry.value[0] === req);
      if (index !== -1) filters.splice(index, 1);
    });

    const finalFilters = [...filters.filter((f) => f.value[0] !== req)];

    filters.forEach((f) => {
      if (
        f.value[0] === "trade_history.value_usd" &&
        title === "token_amount"
      ) {
        finalFilters.push(f);
      }
      if (f.value[0] === "trade_history.token_amount" && title === "Value") {
        finalFilters.push(f);
      }
    });
    finalFilters.push(
      {
        action: "gte",
        value: [req, Number(selectedTradeFilters[filterName][0]) || 0],
      },
      {
        action: "lte",
        value: [
          req,
          Number(selectedTradeFilters[filterName][1]) || 1_000_000_000_000,
        ],
      }
    );
    setFilters(finalFilters);
    setShowTradeFilters(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div className="flex flex-col">
          <SmallFont extraCss="mb-2.5 whitespace-nowrap">
            Min {title === "token_amount" ? "Amount" : title}
          </SmallFont>
          <Input
            extraCss="w-full"
            type="number"
            ref={minRef}
            placeholder={JSON.stringify(min)}
            isInvalid={
              selectedTradeFilters[title.toLowerCase()]?.[1] <
              minRef?.current?.value
            }
            onChange={(e) => {
              setSelectedTradeFilters((prevState) => ({
                ...prevState,
                [title.toLowerCase()]: [
                  e.target.value,
                  prevState[title.toLowerCase()]
                    ? prevState[title.toLowerCase()][1]
                    : Infinity,
                ],
              }));
              setMin(Number(e.target.value));
            }}
          />
        </div>
        <SmallFont extraCss="mx-[15px] mt-[37px]">To</SmallFont>
        <div className="flex flex-col">
          <SmallFont extraCss="mb-2.5 whitespace-nowrap">
            Max {title === "token_amount" ? "Amount" : title}
          </SmallFont>
          <Input
            extraCss="w-full"
            placeholder={max === 1000000000000 ? "Any" : JSON.stringify(max)}
            isInvalid={
              selectedTradeFilters[title.toLowerCase()]?.[0] >
              maxRef?.current?.value
            }
            type="number"
            ref={maxRef}
            onChange={(e) => {
              setSelectedTradeFilters((prevState) => ({
                ...prevState,
                [title.toLowerCase()]: [
                  prevState[title.toLowerCase()]
                    ? prevState[title.toLowerCase()][0]
                    : 0,
                  e.target.value,
                ],
              }));
              setMax(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className={cn("flex mt-5", extraCss)}>
        <Button
          extraCss={`${cancelButtonStyle} w-[50%]`}
          onClick={() => {
            setSelectedTradeFilters({
              ...selectedTradeFilters,
              [title.toLowerCase()]: [0, 1_000_000_000_000],
            });
            setActiveName((prev) => ({
              ...prev,
              [title.toLowerCase()]: `Any${
                title === "token_amount" ? " Amount" : " Value"
              }`,
            }));
            setFilters([]);
            setMin(0);
            setMax(100_000_000_000);
            setShouldInstantLoad(true);
            setStateValue(false);
            if (onClose) onClose();
            setShowTradeFilters(false);
          }}
        >
          Reset
        </Button>
        <Button
          extraCss="h-[30px] max-w-[100px] border-darkblue dark:border-darkblue hover:border-blue dark:border-blue w-[50%]"
          onClick={() => {
            setStateValue(false);
            handleAddFilter(false);
            if (onClose) onClose();
          }}
        >
          Apply
        </Button>{" "}
      </div>
    </div>
  );
};
