import React, { useContext, useState } from "react";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { SwapContext } from "../..";
import { SmallFont } from "../../../../components/fonts";
import { Popover } from "../../../../components/popover";
import { pushData } from "../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../utils/formaters";
import { famousContractsLabelFromName } from "../../utils";

interface InfoPopupProps {
  isSwapRouter: boolean;
  children: React.ReactNode;
}

export const InfoPopupQuotes = ({ isSwapRouter, children }: InfoPopupProps) => {
  const [show, setShow] = useState(false);
  const { quotes, tokenOut, setManualQuote, manualQuote } =
    useContext(SwapContext);

  const getColorOfActiveProtocol = (i: number): string => {
    if (manualQuote) {
      if (manualQuote?.protocol === quotes?.[i]?.protocol)
        return "text-blue dark:text-blue";
      return "text-light-font-100 dark:text-dark-font-100";
    }
    if (i === 0) return "text-blue dark:text-blue";
    return "text-light-font-100 dark:text-dark-font-100";
  };

  return (
    <Popover
      position="end"
      isOpen={show}
      visibleContent={
        !isSwapRouter ? (
          <AiOutlineInfoCircle
            className="ml-2.5 text-sm md:text-[13px] sm:text-[12px] text-light-font-40 dark:text-dark-font-40 mt-0.5"
            onMouseEnter={() => setShow(true)}
          />
        ) : (
          <div className="pb-2.5" onMouseEnter={() => setShow(true)}>
            {children}
          </div>
        )
      }
      hiddenContent={
        <div className="min-w-[200px] shadow-xl">
          <div className="flex items-center justify-between mb-2.5">
            <SmallFont>Manually select a router</SmallFont>
            <AiOutlineClose
              className="cursor-pointer"
              onClick={() => setShow(false)}
            />
          </div>
          {quotes?.map((entry, i) => (
            <div
              className="flex justify-between items-center cursor-pointer my-[3.5px] hover:text-blue"
              key={entry.protocol}
              onClick={() => {
                setManualQuote(entry);
                pushData("TRADE-SWITCH-ROUTE");
                setShow(false);
              }}
            >
              <div className="flex items-center">
                <img
                  className="w-[18px] h-[18px] mr-[5px] rounded-full"
                  src={famousContractsLabelFromName[entry.protocol]?.logo}
                />
                <SmallFont>{entry.protocol}</SmallFont>
              </div>
              <div className="flex items-center ml-2.5">
                <p
                  className={`text-sm md:text-xs ${getColorOfActiveProtocol(
                    i
                  )} mr-[5px] text-medium`}
                >
                  {getFormattedAmount(
                    entry.amountOut / 10 ** tokenOut!.decimals,
                    -2
                  )}
                </p>
                <img
                  src={tokenOut?.logo || "/empty/unknown.png"}
                  className="rounded-full w-[14px] h-[14px] min-w-[14px]"
                />
              </div>
            </div>
          ))}
        </div>
      }
      onToggle={() => setShow((prev) => !prev)}
    />
  );
};
