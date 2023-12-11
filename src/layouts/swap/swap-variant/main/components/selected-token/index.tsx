import React, { useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { SwapContext } from "../../../..";
import { SmallFont } from "../../../../../../components/fonts";

interface SelectedTokenProps {
  isTokenIn?: boolean;
  isDefault?: boolean;
}

export const SelectedToken = ({ isTokenIn, isDefault }: SelectedTokenProps) => {
  const { tokenIn, tokenOut, tokenOutBuffer, tokenInBuffer } =
    useContext(SwapContext);
  const token = isTokenIn ? tokenIn : tokenOut;
  const buffer = isTokenIn ? tokenInBuffer : tokenOutBuffer;

  return (
    <div
      className="flex items-center px-2.5 rounded-full border-light-border-primary dark:border-dark-border-primary 
    h-[30px] bg-light-bg-terciary dark:bg-dark-bg-terciary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
    transition-all duration-200 ease-in-out"
    >
      {!isDefault ? (
        <img
          src={buffer?.logo || token?.logo || "/empty/unknown.png"}
          className="w-[15px] h-[15px] rounded-full"
          alt={`${token?.name} logo`}
        />
      ) : null}
      <SmallFont
        extraCss={`${isDefault ? "" : "ml-[7.5px]"} mr-[3px] whitespace-nowrap`}
      >
        {isDefault ? "Select a token" : buffer?.symbol || token?.symbol}
      </SmallFont>
      {!tokenOutBuffer || isTokenIn || isDefault ? (
        <BsChevronDown
          className={`text-light-font-100 dark:text-dark-font-100 text-[17px] md:text-[15px] ${
            isDefault ? "" : "mr-2.5"
          }`}
        />
      ) : null}
    </div>
  );
};
