import React, { Dispatch, SetStateAction, useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { SwapContext } from "../..";
import { SmallFont } from "../../../../components/fonts";
import { getRightPrecision } from "../../../../utils/formaters";

interface SmallSwapLineProps {
  position?: "in" | "out";
  setSelectVisible?: Dispatch<SetStateAction<string | boolean | undefined>>;
  inputRef?: HTMLInputElement | null;
}

export const SmallSwapLine = ({
  setSelectVisible,
  inputRef,
  position,
}: SmallSwapLineProps) => {
  const { tokenIn, tokenOut, setAmountIn, amountIn, amountOut } =
    useContext(SwapContext);
  const token = position === "in" ? tokenIn : tokenOut;
  const amount = position === "in" ? amountIn : amountOut;
  const setAmount = position === "in" ? setAmountIn : undefined;

  return (
    <div
      className={`flex justify-between bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border
     border-light-border-primary dark:border-dark-border-primary p-[5px] ${
       position === "out" ? "mt-[10px]" : "mt-0"
     }`}
    >
      <div className="flex w-full">
        <div className="flex bg-light-bg-terciary dark:bg-dark-bg-terciary h-[30px] justify-center items-center px-[7.5px] rounded-lg">
          <img
            className="w-[21px] h-[21px] min-w-[21px] rounded-full"
            src={token?.logo || "/empty/unknown.png"}
          />
          <SmallFont extraCss="ml-[7.5px]">{token?.symbol}</SmallFont>
        </div>
        {position === "out" ? null : (
          <button
            className="ml-[5px]"
            onClick={() => {
              if (!setSelectVisible) return;
              setSelectVisible(true);
            }}
          >
            <BsChevronDown className="text-sm text-light-font-100 dark:text-dark-font-100" />
          </button>
        )}
      </div>
      <div className="flex">
        <input
          className="text-sm text-light-font-100 dark:text-dark-font-100 my-auto text-end pr-[5px] bg-light-bg-secondary dark:bg-dark-bg-secondary"
          type="number"
          lang="en"
          ref={inputRef}
          onChange={(e) => {
            if (!setAmount) return;
            if (
              !Number.isNaN(parseFloat(e.target.value)) ||
              e.target.value === ""
            ) {
              setAmount(e.target.value);
            }
          }}
          value={
            (typeof window !== "undefined" &&
              inputRef?.current === document?.activeElement) ||
            amount === ""
              ? amount
              : (getRightPrecision(amount) as number)
          }
        />
      </div>
    </div>
  );
};
