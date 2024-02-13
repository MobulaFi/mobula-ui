import { useRouter } from "next/navigation";
import React from "react";
import { AddressAvatar } from "../../../components/avatar";
import { NextImageFallback } from "../../../components/image";
import { TableAsset } from "../model";

interface TokenInfoProps {
  token: TableAsset;
  index: number;
  showRank: boolean;
}

export const TokenInfo = ({ token, index, showRank }: TokenInfoProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center w-full">
      <div className="flex w-[26px] h-[26px] min-w-[26px] min-h-[26px] mr-2.5 rounded-full">
        {token?.logo ? (
          <NextImageFallback
            src={token?.logo}
            alt="token logo"
            width={26}
            height={26}
            style={{
              borderRadius: "100%",
            }}
            priority={index < 10}
            fallbackSrc="/empty/unknown.png"
          />
        ) : (
          <AddressAvatar
            extraCss="w-[26px] h-[26px] rounded-full min-w-[26px]"
            address={token?.contracts?.[0] as string}
          />
        )}
      </div>
      <div className="flex flex-col flex-wrap mr-2.5 sm:mr-0">
        <div className="flex">
          {showRank ? (
            <div className="mr-[7.5px] text-sm text-light-font-100 dark:text-dark-font-100 hidden md:block md:text-xs">
              {token.rank}
            </div>
          ) : null}
          <span className="text-light-font-100 dark:text-dark-font-100 text-sm font-bold md:text-xs text-start">
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
