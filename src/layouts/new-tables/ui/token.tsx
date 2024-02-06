import React from "react";
import { NextImageFallback } from "../../../components/image";
import { Asset } from "../../../interfaces/swap";
import { TableAsset } from "../../tables/model";

interface TokenInfoProps {
  token: Asset | TableAsset;
  index: number;
  showRank: boolean;
}

export const TokenInfo = ({ token, index, showRank }: TokenInfoProps) => {
  const checkImage = () => {
    if (token?.logo) {
      if (token.logo["0"] === "h") return token.logo;
      return `https://${token.logo}`;
    }
    return "/icon/unknown.png";
  };
  const image = checkImage();
  return (
    <div className="flex items-center w-full">
      <div className="flex w-[26px] h-[26px] min-w-[26px] min-h-[26px] mr-2.5 rounded-full">
        <NextImageFallback
          src={image}
          alt="token logo"
          width={26}
          height={26}
          style={{
            borderRadius: "100%",
          }}
          priority={index < 10}
          fallbackSrc="/empty/unknown.png"
        />
      </div>
      <div className="flex flex-col flex-wrap mr-2.5 sm:mr-0">
        <div className="flex">
          {showRank ? (
            <div className="mr-[7.5px] text-sm text-light-font-100 dark:text-dark-font-100 hidden md:block md:text-xs">
              {token.rank}
            </div>
          ) : null}
          <span className="text-light-font-100 dark:text-dark-font-100 text-sm font-bold md:text-xs">
            {token.symbol}
          </span>
        </div>
        <span className="truncate mr-2.5 text-xs text-left text-light-font-60 dark:text-dark-font-60 max-w-[130px] md:max-w-[100px] sm:max-w-[90px] w-[130px]">
          {token.name}
        </span>
      </div>
    </div>
  );
};
